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

const PrivacyPolicy: React.FC = () => {
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
            Privacy Policy
          </Typography>
          
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Effective Date: November 17, 2025
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography variant="body1" paragraph>
            At Rapid Sort Inventory Management System, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.
          </Typography>

          {/* Information We Collect */}
          <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
            1. Information We Collect
          </Typography>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            1.1 Information You Provide
          </Typography>
          <List>
            <ListItem>
              <ListItemText 
                primary="Account Information" 
                secondary="Name, email address, phone number, role, and department when you register"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Business Data" 
                secondary="Product information, inventory data, customer details, supplier information, and order records"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Communication Data" 
                secondary="Messages, feedback, and support requests you send to us"
              />
            </ListItem>
          </List>

          <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
            1.2 Information Collected Automatically
          </Typography>
          <List>
            <ListItem>
              <ListItemText 
                primary="Device Information" 
                secondary="Browser type, operating system, device fingerprint for security purposes"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Usage Data" 
                secondary="Pages visited, features used, time spent, and interaction patterns"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Location Data" 
                secondary="IP address and geographic location for security and fraud prevention"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Security Events" 
                secondary="Login attempts, access patterns, and security-related activities"
              />
            </ListItem>
          </List>

          {/* How We Use Information */}
          <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
            2. How We Use Your Information
          </Typography>
          <Typography variant="body1" paragraph>
            We use the collected information for the following purposes:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="• Provide, operate, and maintain our Service" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Process your transactions and manage your account" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Send you technical notices, updates, and security alerts" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Respond to your comments, questions, and customer service requests" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Monitor and analyze usage patterns to improve our Service" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Detect, prevent, and address technical issues and security threats" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Comply with legal obligations and enforce our Terms" />
            </ListItem>
          </List>

          {/* Data Security */}
          <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
            3. Data Security
          </Typography>
          <Typography variant="body1" paragraph>
            We implement comprehensive security measures to protect your data:
          </Typography>
          
          <Box sx={{ bgcolor: '#e8f5e9', p: 3, borderRadius: 2, my: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Technical Security Measures
            </Typography>
            <List dense>
              <ListItem>
                <ListItemText primary="✅ JWT Authentication - Secure token-based authentication" />
              </ListItem>
              <ListItem>
                <ListItemText primary="✅ bcrypt Password Hashing - Industry-standard password protection with 12 rounds" />
              </ListItem>
              <ListItem>
                <ListItemText primary="✅ HTTPS/TLS Encryption - All data transmitted over secure connections" />
              </ListItem>
              <ListItem>
                <ListItemText primary="✅ Zero-Trust Architecture - Continuous verification and risk assessment" />
              </ListItem>
              <ListItem>
                <ListItemText primary="✅ Role-Based Access Control - Granular permission management" />
              </ListItem>
              <ListItem>
                <ListItemText primary="✅ Database Encryption - AES-256-GCM for sensitive data at rest" />
              </ListItem>
              <ListItem>
                <ListItemText primary="✅ Security Monitoring - Real-time threat detection and response" />
              </ListItem>
            </List>
          </Box>

          <Typography variant="body1" paragraph>
            Despite our security measures, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to protect your data, we cannot guarantee absolute security.
          </Typography>

          {/* Data Sharing */}
          <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
            4. Data Sharing and Disclosure
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>4.1 We Do Not Sell Your Data:</strong> We do not sell, trade, or rent your personal information to third parties.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>4.2 Service Providers:</strong> We may share your information with trusted third-party service providers who assist us in operating our Service (e.g., hosting, analytics, payment processing). These providers are contractually obligated to protect your data.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>4.3 Legal Requirements:</strong> We may disclose your information if required by law, court order, or governmental request, or to protect our rights and safety.
          </Typography>
          <Typography variant="body1" paragraph>
            <strong>4.4 Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity.
          </Typography>

          {/* Data Retention */}
          <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
            5. Data Retention
          </Typography>
          <Typography variant="body1" paragraph>
            We retain your information for as long as your account is active or as needed to provide you services. We will retain and use your information as necessary to:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="• Comply with legal obligations" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Resolve disputes" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Enforce our agreements" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Maintain security and audit logs (typically 1-7 years)" />
            </ListItem>
          </List>

          {/* Your Rights */}
          <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
            6. Your Privacy Rights
          </Typography>
          <Typography variant="body1" paragraph>
            Depending on your location, you may have the following rights:
          </Typography>
          <List>
            <ListItem>
              <ListItemText 
                primary="Right to Access" 
                secondary="Request a copy of your personal data"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Right to Rectification" 
                secondary="Request correction of inaccurate data"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Right to Erasure" 
                secondary="Request deletion of your data ('right to be forgotten')"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Right to Data Portability" 
                secondary="Receive your data in a structured, machine-readable format"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Right to Object" 
                secondary="Object to processing of your data"
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Right to Withdraw Consent" 
                secondary="Withdraw consent for data processing at any time"
              />
            </ListItem>
          </List>
          <Typography variant="body1" paragraph>
            To exercise these rights, please contact us at privacy@rapidsort.com
          </Typography>

          {/* Cookies and Tracking */}
          <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
            7. Cookies and Tracking Technologies
          </Typography>
          <Typography variant="body1" paragraph>
            We use cookies and similar tracking technologies to:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="• Maintain your session and keep you logged in" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Remember your preferences and settings" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Analyze usage patterns and improve our Service" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Enhance security through device fingerprinting" />
            </ListItem>
          </List>
          <Typography variant="body1" paragraph>
            You can control cookies through your browser settings. However, disabling cookies may limit your ability to use certain features of the Service.
          </Typography>

          {/* Children's Privacy */}
          <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
            8. Children's Privacy
          </Typography>
          <Typography variant="body1" paragraph>
            Our Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please contact us immediately.
          </Typography>

          {/* International Data Transfers */}
          <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
            9. International Data Transfers
          </Typography>
          <Typography variant="body1" paragraph>
            Your information may be transferred to and maintained on servers located outside of your country. We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
          </Typography>

          {/* Changes to Privacy Policy */}
          <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
            10. Changes to This Privacy Policy
          </Typography>
          <Typography variant="body1" paragraph>
            We may update our Privacy Policy from time to time. We will notify you of any changes by:
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="• Posting the new Privacy Policy on this page" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Updating the 'Effective Date' at the top" />
            </ListItem>
            <ListItem>
              <ListItemText primary="• Sending an email notification for material changes" />
            </ListItem>
          </List>

          {/* Contact Us */}
          <Typography variant="h5" gutterBottom fontWeight="bold" sx={{ mt: 4 }}>
            11. Contact Us
          </Typography>
          <Typography variant="body1" paragraph>
            If you have questions about this Privacy Policy or our data practices, please contact us:
          </Typography>
          <Box sx={{ pl: 2, py: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
            <Typography variant="body1"><strong>Rapid Sort Inventory Management</strong></Typography>
            <Typography variant="body1">Privacy Officer</Typography>
            <Typography variant="body1">Email: privacy@rapidsort.com</Typography>
            <Typography variant="body1">Email: support@rapidsort.com</Typography>
            <Typography variant="body1">Website: www.rapidsort.com</Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* GDPR Compliance */}
          <Box sx={{ bgcolor: '#e3f2fd', p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              GDPR Compliance
            </Typography>
            <Typography variant="body2" paragraph>
              For users in the European Economic Area (EEA), we comply with the General Data Protection Regulation (GDPR). You have additional rights including:
            </Typography>
            <Typography variant="body2">
              • Right to lodge a complaint with a supervisory authority<br />
              • Right to restriction of processing<br />
              • Right to object to automated decision-making<br />
              • Right to data portability
            </Typography>
          </Box>

          {/* CCPA Compliance */}
          <Box sx={{ bgcolor: '#fff3e0', p: 3, borderRadius: 2, mt: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              CCPA Compliance (California Residents)
            </Typography>
            <Typography variant="body2" paragraph>
              California residents have specific rights under the California Consumer Privacy Act (CCPA):
            </Typography>
            <Typography variant="body2">
              • Right to know what personal information is collected<br />
              • Right to know if personal information is sold or disclosed<br />
              • Right to say no to the sale of personal information<br />
              • Right to access your personal information<br />
              • Right to equal service and price
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

export default PrivacyPolicy;
