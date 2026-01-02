import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const TermsAndConditions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5', py: 4 }}>
      <Container maxWidth="md">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 3 }}
        >
          Back to Home
        </Button>

        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            Terms and Conditions
          </Typography>
          
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Last Updated: November 17, 2025
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Introduction */}
          <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
            1. Introduction
          </Typography>
          <Typography variant="body1" paragraph>
            Welcome to Rapid Sort Inventory Management System ("we," "our," or "us"). These Terms and Conditions ("Terms") govern your access to and use of our inventory management software, website, and related services (collectively, the "Service").
          </Typography>
          <Typography variant="body1" paragraph>
            By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these Terms, you may not access the Service.
          </Typography>

          {/* Account Registration */}
          <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
            2. Account Registration and Security
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>2.1 Account Creation:</strong> To use our Service, you must create an account by providing accurate, complete, and current information. You are responsible for maintaining the confidentiality of your account credentials.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>2.2 User Roles:</strong> Our system supports multiple user roles (Admin, Manager, Employee) with different access levels. You agree to use only the permissions granted to your role.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>2.3 Account Security:</strong> You are responsible for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account or any other breach of security.
          </Typography>

          {/* Service Description */}
          <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
            3. Service Description
          </Typography>
          <Typography variant="body1" paragraph>
            Rapid Sort provides a comprehensive inventory management solution specifically designed for modern businesses that includes:
          </Typography>
          <List>
            <ListItem>
              <ListItemText 
                primary="• Real-time Inventory Tracking" 
                secondary="Monitor stock levels, track product movements, and receive instant low-stock alerts"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="• Smart Product Management" 
                secondary="Organize products by categories, SKUs, suppliers with bulk operations support"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="• Order & Customer Management" 
                secondary="Process orders efficiently, manage customer relationships, and track order history"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="• Supplier Integration" 
                secondary="Manage supplier relationships, track purchase orders, and automate reordering"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="• Advanced Analytics & Reporting" 
                secondary="Generate insights with revenue tracking, growth analysis, and customizable reports"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="• Multi-Database Architecture" 
                secondary="Powered by MongoDB, Redis caching, PostgreSQL, Neo4j, and InfluxDB for optimal performance"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="• Real-time Notifications" 
                secondary="WebSocket-powered instant updates for stock changes, orders, and system events"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="• Role-Based Access Control" 
                secondary="Admin, Manager, and Employee roles with granular permission management"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="• Cloud Synchronization" 
                secondary="Access your data anywhere with automatic cloud backup and multi-device sync"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="• Export & Integration" 
                secondary="Export data to CSV, PDF, Excel, and integrate with third-party systems via API"
              />
            </ListItem>
          </List>

          {/* User Obligations */}
          <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
            4. User Obligations and Acceptable Use
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>4.1 Permitted Use:</strong> You agree to use the Service only for lawful purposes and in accordance with these Terms.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>4.2 Prohibited Activities:</strong> You agree NOT to:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="• Use the Service for any illegal or unauthorized purpose" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Attempt to gain unauthorized access to any portion of the Service" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Interfere with or disrupt the Service or servers" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Upload or transmit viruses, malware, or malicious code" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Reverse engineer, decompile, or disassemble the Service" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Share your account credentials with unauthorized users" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Use the Service to store or transmit infringing or unlawful content" />
            </ListItem>
          </List>

          {/* Data and Privacy */}
          <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
            5. Data and Privacy
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>5.1 Your Data:</strong> You retain all rights to the data you input into the Service. We claim no ownership rights over your data.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>5.2 Data Security:</strong> We implement industry-standard security measures including:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="• JWT (JSON Web Token) authentication" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• bcrypt password hashing with salt" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• HTTPS/TLS encryption for data in transit" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Zero-Trust security architecture with continuous verification" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Role-based access control (RBAC)" />
            </ListItem>
          </List>
          <Typography variant="body1" paragraph>
            <strong>5.3 Data Backup:</strong> While we perform regular backups, you are responsible for maintaining your own backup copies of your data.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>5.4 Privacy Policy:</strong> Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
          </Typography>

          {/* Intellectual Property */}
          <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
            6. Intellectual Property Rights
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>6.1 Our Rights:</strong> The Service, including its original content, features, and functionality, is owned by Rapid Sort and is protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>6.2 License Grant:</strong> Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to access and use the Service for your internal business purposes.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>6.3 Restrictions:</strong> You may not copy, modify, distribute, sell, or lease any part of our Service without our prior written consent.
          </Typography>

          {/* Payment and Subscription */}
          <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
            7. Payment and Subscription Terms
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>7.1 Subscription Plans:</strong> We offer various subscription plans with different features and pricing. Details are available on our pricing page.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>7.2 Payment:</strong> You agree to pay all fees associated with your chosen subscription plan. Payments are processed securely through our payment providers.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>7.3 Automatic Renewal:</strong> Subscriptions automatically renew unless cancelled before the renewal date. You will be charged the then-current rate.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>7.4 Refunds:</strong> Refunds are provided in accordance with our refund policy. Generally, we offer a 30-day money-back guarantee for new subscriptions.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>7.5 Free Trial:</strong> We may offer a free trial period. At the end of the trial, you will be charged unless you cancel before the trial ends.
          </Typography>

          {/* Service Availability */}
          <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
            8. Service Availability and Modifications
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>8.1 Availability:</strong> We strive to provide 99.9% uptime but do not guarantee uninterrupted access to the Service. Scheduled maintenance will be announced in advance when possible.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>8.2 Modifications:</strong> We reserve the right to modify, suspend, or discontinue any part of the Service at any time with reasonable notice.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>8.3 Updates:</strong> We may release updates, patches, and new features. You agree to accept such updates as part of your use of the Service.
          </Typography>

          {/* Termination */}
          <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
            9. Termination
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>9.1 By You:</strong> You may terminate your account at any time by contacting us or using the account cancellation feature.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>9.2 By Us:</strong> We may terminate or suspend your account immediately, without prior notice, if you breach these Terms or engage in fraudulent or illegal activities.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>9.3 Effect of Termination:</strong> Upon termination, your right to use the Service will immediately cease. We will provide you with a reasonable opportunity to export your data.
          </Typography>

          {/* Disclaimers and Limitations */}
          <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
            10. Disclaimers and Limitations of Liability
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>10.1 "AS IS" Basis:</strong> THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>10.2 No Warranty:</strong> WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE, OR THAT DEFECTS WILL BE CORRECTED.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>10.3 Limitation of Liability:</strong> TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF YOUR USE OF THE SERVICE.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>10.4 Maximum Liability:</strong> Our total liability to you for all claims arising from your use of the Service shall not exceed the amount you paid us in the 12 months preceding the claim.
          </Typography>

          {/* Indemnification */}
          <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
            11. Indemnification
          </Typography>
          <Typography variant="body1" paragraph>
            You agree to indemnify, defend, and hold harmless Rapid Sort, its officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses arising from:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="• Your use of the Service" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Your violation of these Terms" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Your violation of any rights of another party" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Your data or content submitted through the Service" />
            </ListItem>
          </List>

          {/* Governing Law */}
          <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
            12. Governing Law and Dispute Resolution
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>12.1 Governing Law:</strong> These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>12.2 Dispute Resolution:</strong> Any disputes arising from these Terms or your use of the Service shall first be attempted to be resolved through good-faith negotiations.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>12.3 Arbitration:</strong> If negotiations fail, disputes shall be resolved through binding arbitration in accordance with the rules of [Arbitration Association].
          </Typography>

          {/* General Provisions */}
          <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
            13. General Provisions
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>13.1 Entire Agreement:</strong> These Terms constitute the entire agreement between you and Rapid Sort regarding the Service.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>13.2 Severability:</strong> If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full effect.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>13.3 Waiver:</strong> Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>13.4 Assignment:</strong> You may not assign or transfer these Terms without our prior written consent. We may assign our rights without restriction.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>13.5 Force Majeure:</strong> We shall not be liable for any failure to perform due to circumstances beyond our reasonable control.
          </Typography>

          {/* Changes to Terms */}
          <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
            14. Changes to Terms
          </Typography>
          <Typography variant="body1" paragraph>
            We reserve the right to modify these Terms at any time. We will notify you of material changes by:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="• Posting the updated Terms on our website" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Sending an email notification to your registered email address" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Displaying a prominent notice within the Service" />
            </ListItem>
          </List>
          <Typography variant="body1" paragraph>
            Your continued use of the Service after such modifications constitutes your acceptance of the updated Terms.
          </Typography>

          {/* Contact Information */}
          <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
            15. Contact Information
          </Typography>
          <Typography variant="body1" paragraph>
            If you have any questions about these Terms, please contact us at:
          </Typography>
          <Box sx={{ pl: 2, py: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="body1"><strong>Rapid Sort Inventory Management</strong></Typography>
            <Typography variant="body1">Email: legal@rapidsort.com</Typography>
            <Typography variant="body1">Email: support@rapidsort.com</Typography>
            <Typography variant="body1">Website: www.rapidsort.com</Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Acknowledgment */}
          <Box sx={{ bgcolor: '#e3f2fd', p: 3, borderRadius: 2, mt: 4 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Acknowledgment
            </Typography>
            <Typography variant="body2">
              BY USING THE SERVICE, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS AND CONDITIONS, UNDERSTAND THEM, AND AGREE TO BE BOUND BY THEM. IF YOU DO NOT AGREE TO THESE TERMS, YOU MUST NOT USE THE SERVICE.
            </Typography>
          </Box>

          {/* Technical Security Notice */}
          <Box sx={{ bgcolor: '#f3e5f5', p: 3, borderRadius: 2, mt: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Security & Technical Implementation
            </Typography>
            <Typography variant="body2" paragraph>
              Our platform implements enterprise-grade security measures including:
            </Typography>
            <Typography variant="body2" component="div">
              • <strong>Authentication:</strong> JWT (JSON Web Tokens) with secure token management<br />
              • <strong>Password Security:</strong> bcrypt hashing with salt (12 rounds)<br />
              • <strong>Encryption:</strong> AES-256-GCM for sensitive data, SHA-256/512 for data integrity<br />
              • <strong>Transport Security:</strong> HTTPS/TLS 1.2+ for all communications<br />
              • <strong>Zero-Trust Architecture:</strong> Continuous verification and risk assessment<br />
              • <strong>Database Security:</strong> Multiple database systems with proper indexing and replication<br />
              • <strong>Real-time Monitoring:</strong> WebSocket connections with JWT authentication
            </Typography>
          </Box>
        </Paper>

        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/')}
            sx={{
              px: 4,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            Return to Home
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default TermsAndConditions;
