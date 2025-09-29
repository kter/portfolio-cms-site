import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as certificatemanager from 'aws-cdk-lib/aws-certificatemanager';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Import existing hosted zone for tomohiko.io
    const hostedZone = route53.HostedZone.fromLookup(this, 'HostedZone', {
      domainName: 'tomohiko.io'
    });

    // Create S3 bucket for static website hosting
    const websiteBucket = new s3.Bucket(this, 'WebsiteBucket', {
      bucketName: 'www.tomohiko.io',
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // Create Origin Access Control for CloudFront
    const originAccessControl = new cloudfront.CfnOriginAccessControl(this, 'OriginAccessControl', {
      originAccessControlConfig: {
        name: 'www-tomohiko-io-oac',
        originAccessControlOriginType: 's3',
        signingBehavior: 'always',
        signingProtocol: 'sigv4',
      },
    });

    // Create SSL certificate for www.tomohiko.io (must be in us-east-1 for CloudFront)
    const certificate = new certificatemanager.Certificate(this, 'SiteCertificate', {
      domainName: 'www.tomohiko.io',
      subjectAlternativeNames: ['tomohiko.io'],
      validation: certificatemanager.CertificateValidation.fromDns(hostedZone),
    });

    // Create CloudFront distribution with S3 static website hosting
    const distribution = new cloudfront.Distribution(this, 'SiteDistribution', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(websiteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
        compress: true,
        functionAssociations: [{
          function: new cloudfront.Function(this, 'RedirectFunction', {
            code: cloudfront.FunctionCode.fromInline(`
              function handler(event) {
                var request = event.request;
                var uri = request.uri;
                var host = request.headers.host.value;

                // Redirect non-www to www
                if (host === 'tomohiko.io') {
                  return {
                    statusCode: 301,
                    statusDescription: 'Moved Permanently',
                    headers: {
                      location: { value: 'https://www.tomohiko.io' + uri }
                    }
                  };
                }

                // Check if the URI doesn't have a file extension
                if (uri.length > 1 && !uri.includes('.') && !uri.endsWith('/')) {
                  // Append index.html to the URI
                  request.uri = uri + '/index.html';
                } else if (uri.endsWith('/')) {
                  // Append index.html to directory requests
                  request.uri = uri + 'index.html';
                }

                return request;
              }
            `),
          }),
          eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
        }],
      },
      domainNames: ['www.tomohiko.io', 'tomohiko.io'],
      certificate: certificate,
      minimumProtocolVersion: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 404,
          responsePagePath: '/404.html',
          ttl: cdk.Duration.minutes(30),
        },
        {
          httpStatus: 403,
          responseHttpStatus: 404,
          responsePagePath: '/404.html',
          ttl: cdk.Duration.minutes(30),
        },
      ],
      defaultRootObject: 'index.html',
    });

    // Create Route53 records
    new route53.ARecord(this, 'SiteAliasRecord', {
      recordName: 'www.tomohiko.io',
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
      zone: hostedZone,
    });

    new route53.ARecord(this, 'ApexAliasRecord', {
      recordName: 'tomohiko.io',
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
      zone: hostedZone,
    });

    // Import existing GitHub OIDC Provider
    const githubOidcProvider = iam.OpenIdConnectProvider.fromOpenIdConnectProviderArn(
      this, 
      'GitHubOidcProvider',
      `arn:aws:iam::${this.account}:oidc-provider/token.actions.githubusercontent.com`
    );

    // Create IAM role for GitHub Actions
    const githubActionsRole = new iam.Role(this, 'GitHubActionsRole', {
      roleName: 'PortfolioSiteGitHubActionsRole',
      assumedBy: new iam.WebIdentityPrincipal(githubOidcProvider.openIdConnectProviderArn, {
        StringEquals: {
          'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
        },
        StringLike: {
          'token.actions.githubusercontent.com:sub': 'repo:kter/portfolio-cms-site:ref:refs/heads/main',
        },
      }),
      description: 'Role for GitHub Actions to deploy portfolio site',
    });

    // Add permissions for S3 operations
    githubActionsRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        's3:GetObject',
        's3:PutObject',
        's3:DeleteObject',
        's3:ListBucket',
        's3:GetBucketLocation',
      ],
      resources: [
        websiteBucket.bucketArn,
        websiteBucket.arnForObjects('*'),
      ],
    }));

    // Add permissions for CloudFront operations
    githubActionsRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'cloudfront:CreateInvalidation',
        'cloudfront:GetInvalidation',
        'cloudfront:ListInvalidations',
      ],
      resources: [`arn:aws:cloudfront::${this.account}:distribution/${distribution.distributionId}`],
    }));

    // Add permissions for CloudFormation operations (to get stack outputs and deploy)
    githubActionsRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'cloudformation:DescribeStacks',
        'cloudformation:DescribeStackResources',
        'cloudformation:DescribeStackEvents',
        'cloudformation:GetTemplate',
        'cloudformation:UpdateStack',
        'cloudformation:CreateChangeSet',
        'cloudformation:DescribeChangeSet',
        'cloudformation:ExecuteChangeSet',
        'cloudformation:DeleteChangeSet',
        'cloudformation:GetStackPolicy',
      ],
      resources: [this.stackId],
    }));

    // Add permissions for SSM parameter access (required for CDK bootstrap verification)
    githubActionsRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'ssm:GetParameter',
        'ssm:GetParameters',
      ],
      resources: [
        `arn:aws:ssm:${this.region}:${this.account}:parameter/cdk-bootstrap/*`,
      ],
    }));

    // Add permissions for CloudFront Function deployment
    githubActionsRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        'cloudfront:CreateFunction',
        'cloudfront:UpdateFunction',
        'cloudfront:DeleteFunction',
        'cloudfront:DescribeFunction',
        'cloudfront:GetFunction',
        'cloudfront:ListFunctions',
        'cloudfront:UpdateDistribution',
        'cloudfront:GetDistribution',
        'cloudfront:GetDistributionConfig',
      ],
      resources: ['*'], // CloudFront Functions require wildcard resource
    }));

    // Output important values
    new cdk.CfnOutput(this, 'BucketName', {
      value: websiteBucket.bucketName,
      description: 'Name of the S3 bucket',
    });

    new cdk.CfnOutput(this, 'DistributionId', {
      value: distribution.distributionId,
      description: 'CloudFront Distribution ID',
    });

    new cdk.CfnOutput(this, 'DistributionDomainName', {
      value: distribution.distributionDomainName,
      description: 'CloudFront Distribution Domain Name',
    });

    new cdk.CfnOutput(this, 'WebsiteURL', {
      value: 'https://www.tomohiko.io',
      description: 'Website URL',
    });

    new cdk.CfnOutput(this, 'GitHubActionsRoleArn', {
      value: githubActionsRole.roleArn,
      description: 'ARN of the GitHub Actions IAM Role',
    });
  }
}
