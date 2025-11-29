import "./style.css";

const PrivacyPolicyPage = () => {
    return (
        <div className="legal-page">
            <div className="legal-header">
                <h1>Privacy Policy</h1>
                <p className="last-updated">Last Updated: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="legal-content">
                <section className="legal-section">
                    <h2>1. Information We Collect</h2>
                    <p>
                        <strong>1.1 Personal Information:</strong> When you register for an account, we collect:
                    </p>
                    <ul>
                        <li>Full name and contact information</li>
                        <li>Email address and phone number</li>
                        <li>Library card number (if applicable)</li>
                        <li>User preferences and settings</li>
                    </ul>
                    
                    <p>
                        <strong>1.2 Usage Data:</strong> We automatically collect information about your interactions with our system:
                    </p>
                    <ul>
                        <li>Books borrowed, reserved, or wishlisted</li>
                        <li>Loan history and due dates</li>
                        <li>Search queries and browsing activity</li>
                        <li>Device information and IP address</li>
                    </ul>
                </section>

                <section className="legal-section">
                    <h2>2. How We Use Your Information</h2>
                    <p>
                        We use the collected information for the following purposes:
                    </p>
                    <ul>
                        <li>To provide and maintain library services</li>
                        <li>To manage book loans, reservations, and returns</li>
                        <li>To send notifications about due dates and available books</li>
                        <li>To improve our services and user experience</li>
                        <li>To prevent fraud and ensure system security</li>
                        <li>To comply with legal obligations</li>
                    </ul>
                </section>

                <section className="legal-section">
                    <h2>3. Data Sharing and Disclosure</h2>
                    <p>
                        <strong>3.1 Service Providers:</strong> We may share information with trusted third parties who assist us in operating our system, subject to confidentiality agreements.
                    </p>
                    <p>
                        <strong>3.2 Legal Requirements:</strong> We may disclose your information where required by law or to protect our rights and safety.
                    </p>
                    <p>
                        <strong>3.3 Non-Personal Data:</strong> We may share aggregated, anonymized data for statistical analysis and service improvement.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>4. Data Security</h2>
                    <p>
                        We implement appropriate security measures to protect your personal information:
                    </p>
                    <ul>
                        <li>Encryption of sensitive data in transit and at rest</li>
                        <li>Secure authentication protocols</li>
                        <li>Regular security assessments and updates</li>
                        <li>Limited access to personal information on a need-to-know basis</li>
                    </ul>
                </section>

                <section className="legal-section">
                    <h2>5. Data Retention</h2>
                    <p>
                        We retain your personal information for as long as necessary to provide library services and comply with legal obligations. Loan history is typically retained for 3 years after account inactivity.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>6. Your Rights</h2>
                    <p>
                        You have the right to:
                    </p>
                    <ul>
                        <li>Access and review your personal information</li>
                        <li>Correct inaccurate or incomplete data</li>
                        <li>Request deletion of your personal information</li>
                        <li>Opt-out of promotional communications</li>
                        <li>Export your data in a portable format</li>
                    </ul>
                    <p>
                        To exercise these rights, please contact us using the information below.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>7. Cookies and Tracking</h2>
                    <p>
                        We use cookies and similar technologies to:
                    </p>
                    <ul>
                        <li>Maintain your login session</li>
                        <li>Remember your preferences</li>
                        <li>Analyze system usage and performance</li>
                        <li>Improve service functionality</li>
                    </ul>
                    <p>
                        You can control cookie settings through your browser preferences.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>8. Children's Privacy</h2>
                    <p>
                        Our service is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>9. Changes to This Policy</h2>
                    <p>
                        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>10. Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at:
                        <br />
                        <strong>Email:</strong> privacy@hotelgroup.com
                        <br />
                        <strong>Phone:</strong> (555) 123-PRIVACY
                        <br />
                        <strong>Address:</strong> Hotel Group Data Protection Office, 123 Library Lane, Bookville, BK 12345
                    </p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;