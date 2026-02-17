import { Link } from 'react-router-dom'
import './App.css'

function PrivacyPolicy() {
  return (
    <main className="page-shell">
      <div className="backdrop" aria-hidden="true" />
      <section className="hero">
        <p className="eyebrow">Image Resizer</p>
        <h1>Privacy Policy</h1>
        <p className="subtitle">
          <Link to="/">Back to Image Resizer</Link>
        </p>
      </section>

      <section className="panel policy" aria-label="Privacy Policy">
        <p><strong>App Name:</strong> Image Resizer</p>
        <p><strong>Developer:</strong> Hemadri Kurukuti</p>
        <p><strong>Contact:</strong> techinnovatelabs2@gmail.com</p>
        <p><strong>Effective Date:</strong> Februvary 17, 2025</p>

        <h3>1. Overview</h3>
        <p>
          Your privacy is our priority. This Privacy Policy outlines how the Habituated application
          manages and safeguards user information.
        </p>

        <h3>2. Information We Collect</h3>
        <p>
          We do not collect, store, or process any personal or sensitive information from users.
          Specifically, the application does not gather:
        </p>
        <ul>
          <li>Personally identifiable information (e.g., name, age, gender)</li>
          <li>Location data</li>
          <li>Device identifiers or hardware details</li>
          <li>Usage analytics or diagnostic data</li>
          <li>Payment or financial information</li>
          <li>Any other form of personal data</li>
        </ul>

        <h3>3. Data Storage</h3>
        <p>
          All information entered or generated within the app is stored locally on your device. No
          data is transmitted to external servers, cloud storage, or any remote infrastructure.
        </p>

        <h3>4. Third-Party Services</h3>
        <p>
          The application does not integrate or utilize any third-party services or software
          development kits (SDKs), including but not limited to Firebase, Google Maps, or social
          media SDKs.
        </p>

        <h3>5. Data Sharing</h3>
        <p>No user data is disclosed, sold, or otherwise shared with any third party.</p>

        <h3>6. Children&apos;s Privacy</h3>
        <p>
          We do not knowingly collect any personal information from children. Should we become aware
          that personal information has been inadvertently provided through any channel outside the
          app, we will take prompt measures to remove it.
        </p>

        <h3>7. Security</h3>
        <p>
          As all data is stored solely on the device, maintaining security is the responsibility of
          the user. This includes implementing screen locks, keeping the operating system updated,
          and performing regular backups.
        </p>

        <h3>8. Changes to This Policy</h3>
        <p>
          We may revise this Privacy Policy periodically to align with updates to the application or
          changes in legal requirements. The updated version will be published on this page with a
          new effective date.
        </p>

        <h3>9. Contact Us</h3>
        <p>
          For any queries or concerns regarding this Privacy Policy, please contact:
          techinnovatelabs2@gmail.com
        </p>

        <p>
          <strong>Note:</strong> If future updates introduce new functionalities such as analytics,
          remote data storage, or cloud synchronization, this Privacy Policy and your Google Play
          Data Safety disclosures must be updated accordingly.
        </p>
      </section>
    </main>
  )
}

export default PrivacyPolicy
