import "./style.css";

const TermsAndConditionsPage = () => {
    return (
        <div className="legal-page">
            <div className="legal-header">
                <h1>Terms and Conditions</h1>
                <p className="last-updated">Last Updated: {new Date().toLocaleDateString()}</p>
            </div>

            <div className="legal-content">
                <section className="legal-section">
                    <h2>1. Acceptance of Terms</h2>
                    <p>
                        By accessing and using the Hotel Group Library Management System, you accept and agree to be bound by the terms and provision of this agreement.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>2. User Accounts</h2>
                    <p>
                        <strong>2.1 Account Creation:</strong> Users must provide accurate and complete information during registration. Each user may maintain only one account.
                    </p>
                    <p>
                        <strong>2.2 Account Security:</strong> You are responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account.
                    </p>
                    <p>
                        <strong>2.3 Account Termination:</strong> We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activities.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>3. Book Loans and Reservations</h2>
                    <p>
                        <strong>3.1 Loan Period:</strong> Standard loan period is 14 days unless otherwise specified. Renewals are subject to availability.
                    </p>
                    <p>
                        <strong>3.2 Late Returns:</strong> Overdue books will incur fines of $0.50 per day per item. Accounts with excessive overdue items may be suspended.
                    </p>
                    <p>
                        <strong>3.3 Reservations:</strong> Reserved items must be collected within 48 hours of notification. Unclaimed reservations will be released to other users.
                    </p>
                    <p>
                        <strong>3.4 Damage/Loss:</strong> Users are responsible for any damage to or loss of borrowed materials and will be charged replacement costs.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>4. User Conduct</h2>
                    <p>
                        Users agree not to:
                    </p>
                    <ul>
                        <li>Attempt to access administrative features without authorization</li>
                        <li>Manipulate or attempt to manipulate the system in any way</li>
                        <li>Share account credentials with others</li>
                        <li>Use the system for any illegal or unauthorized purpose</li>
                        <li>Upload or transmit any malicious code</li>
                    </ul>
                </section>

                <section className="legal-section">
                    <h2>5. Intellectual Property</h2>
                    <p>
                        All content, features, and functionality of this library management system are and will remain the exclusive property of Hotel Group and its licensors.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>6. Limitation of Liability</h2>
                    <p>
                        Hotel Group shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of or inability to use the service.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>7. Changes to Terms</h2>
                    <p>
                        We reserve the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the modified terms.
                    </p>
                </section>

                <section className="legal-section">
                    <h2>8. Contact Information</h2>
                    <p>
                        For questions about these Terms and Conditions, please contact us at:
                        <br />
                        <strong>Email:</strong> library-support@hotelgroup.com
                        <br />
                        <strong>Phone:</strong> (555) 123-LIBRARY
                    </p>
                </section>
            </div>
        </div>
    );
};

export default TermsAndConditionsPage;