# ScriptZon - Custom Domain Setup Instructions

This guide will walk you through the process of connecting your custom .com domain to your ScriptZon application deployed on Render.com.

## Prerequisites

1. A registered .com domain (purchased from a domain registrar like Namecheap, GoDaddy, Google Domains, etc.)
2. Access to your domain registrar's DNS settings
3. Your ScriptZon application deployed on Render.com

## Step 1: Add Your Custom Domain in Render

1. Log in to your Render dashboard at [dashboard.render.com](https://dashboard.render.com)
2. Select your ScriptZon web service
3. Click on the "Settings" tab
4. Scroll down to the "Custom Domains" section
5. Click "Add Custom Domain"
6. Enter your domain name (e.g., scriptzon.com) and click "Save"
7. Render will provide you with DNS records that you need to add to your domain registrar

## Step 2: Configure DNS Records at Your Domain Registrar

Log in to your domain registrar's website and navigate to the DNS settings for your domain. You'll need to add the following records:

### Option 1: Using CNAME Record (Recommended)

Add a CNAME record pointing your domain to Render:

| Type  | Name | Value                      | TTL    |
|-------|------|----------------------------|--------|
| CNAME | @    | scriptzon.onrender.com     | 3600   |
| CNAME | www  | scriptzon.onrender.com     | 3600   |

Note: Some domain registrars don't allow CNAME records for the root domain (@). In that case, use Option 2.

### Option 2: Using A Records

Add A records pointing your domain to Render's IP addresses:

| Type | Name | Value        | TTL    |
|------|------|--------------|--------|
| A    | @    | 76.76.21.21  | 3600   |
| A    | www  | 76.76.21.21  | 3600   |

## Step 3: Verify Domain Ownership

1. After adding the DNS records, go back to your Render dashboard
2. In the Custom Domains section, you should see your domain listed with a "Verifying" status
3. DNS changes can take up to 48 hours to propagate, but typically happen within a few hours
4. Once Render verifies your domain, the status will change to "Active"

## Step 4: Set Up SSL Certificate

Render automatically provisions and renews SSL certificates for your custom domains using Let's Encrypt. Once your domain is verified, Render will:

1. Issue an SSL certificate for your domain
2. Configure HTTPS for secure connections
3. Automatically redirect HTTP traffic to HTTPS

This process happens automatically and usually takes a few minutes after domain verification.

## Step 5: Update Environment Variables

After your custom domain is set up, you should update the BASE_URL environment variable in your Render dashboard:

1. Go to your ScriptZon web service in the Render dashboard
2. Click on the "Environment" tab
3. Find the BASE_URL variable
4. Update its value to your custom domain (e.g., https://scriptzon.com)
5. Click "Save Changes"
6. Your service will automatically redeploy with the updated environment variable

## Step 6: Test Your Custom Domain

1. Open a web browser and navigate to your custom domain (e.g., https://scriptzon.com)
2. Verify that your ScriptZon application loads correctly
3. Test key functionality like user registration, login, and script generation
4. Check that all links within the application use your custom domain

## Troubleshooting

If you encounter issues with your custom domain setup:

1. **DNS not propagating**: Use a DNS lookup tool like [dnschecker.org](https://dnschecker.org) to check if your DNS records are properly configured and propagated
2. **SSL certificate issues**: Ensure your DNS records are correctly set up and wait a bit longer for the certificate to be issued
3. **Application not loading**: Check the Render logs for any errors and ensure your environment variables are correctly configured
4. **Mixed content warnings**: Make sure all resources in your application use HTTPS

## Additional Resources

- [Render Custom Domains Documentation](https://render.com/docs/custom-domains)
- [DNS Configuration Guide](https://render.com/docs/dns)
- [SSL Certificates on Render](https://render.com/docs/ssl)

If you need further assistance, please contact Render support or reach out to the developer who provided this application.
