import React from 'react'
import PageTitle from '../../Shared/Navigation/PageTitle'
import Layout from '../../Shared/Layout'

const Privacy = () => {
  return (
    <div>
      <PageTitle title="Privacy Policy" />
      <div className="mt-4">
        <p><strong>Cookies &amp; Privacy Policy</strong><br />
          We are committed to safeguarding the privacy of our website visitors; this policy sets out how we will treat your personal information. As a data controller we take all necessary steps to comply with the relevant Data Protection Acts and GDPR guidelines.</p>

        <br/>

        <p>What information do we collect?<br />
          We may collect, store and use the following kinds of personal information:</p>

        <p>a) information about your computer and about your visits to and use of this website (including your IP address, geographical location, browser type and version, operating system, referral source, length of visit, page views, website and navigation);<br />
          b) information that you provide to us for the purpose of registering as a pilot (including Full name, country of residence and email address); and<br />
          c) any other information that you choose to send to us.</p>
        <br/>
        <p><strong>Cookies</strong><br />
          A cookie consists of information sent by a web server to a web browser, and stored by the browser. The information is then sent back to the server each time the browser requests a page from the server. This enables the web server to identify and track the web browser.</p>

        <p>We use both session cookies and persistent cookies on the website. We use the session cookies to keep track of you whilst you navigate the website. We use the persistent cookies to enable our website to recognise you each time you visit.<br />
          Session cookies will be deleted from your computer when you close your browser. Persistent cookies will remain stored on your computer until deleted, or until they reach a specified expiry date.</p>

        <p>For further information on Cookies please visit http://www.allaboutcookies.org.</p>

        <br/>
        <p><strong>Using your Personal Data</strong><br />
          Personal information submitted to us via this website will be used for the purposes specified in this privacy policy or in relevant parts of the website.</p>

        <p>We may use your personal information to:</p>

        <p>(a) administer the website;<br />
          (b) improve your browsing experience by personalising the website (including displaying network information collected by Bush Divers;<br />
          (c) enable your use of the services available on the website;<br />
          (d) send you general communications such notifications and news updates<br />
          (e) deal with enquiries and complaints made by or about you relating to the website.</p>

        <p>We will not without your express consent provide your personal information to any third parties for the purpose of direct marketing.<br />
          We will ensure that any information will be held only as long as is necessary to ensure our service runs smoothly.<br />
          Personal information including your name (first name and last initial); usernames for volanta and MSFS multiplayer; and your country of residence, is used on the pilot roster and public pilot profiles which are available to all visitors to this website.</p>

        <br />
        <p><strong>Disclosures</strong><br />
          We may disclose information about you to any of our staff team insofar as reasonably necessary for the purposes as set out in this privacy policy.<br />
          In addition, we may disclose information about you:</p>

        <p>(a) to the extent that we are required to do so by law;<br />
          (b) in connection with any legal proceedings or prospective legal proceedings;<br />
          (c) in order to establish, exercise or defend our legal rights (including providing information to others for the purposes of fraud prevention and reducing credit risk); and<br />
          (d) to the purchaser (or prospective purchaser) of any assets which we are (or are contemplating) selling.</p>

        <p>Except as provided in this privacy policy, we will not provide your information to third parties.</p>

        <br />
        <p><strong>Security</strong><br />
          We will take reasonable technical and organisational precautions to prevent the loss, misuse or alteration of your personal information. We will store all the personal information you provide on our secure password and firewall protected server. Of course, data transmission over the internet is inherently insecure, and we cannot guarantee the security of data sent over the internet. You are responsible for keeping your password and user details confidential.</p>

        <br />
        <p><strong>Your Rights</strong><br />
          Under the Data Protection Act you have the right to request a copy of the personal information that we holds about you and to have any inaccuracies corrected. (We charge $10 for information requests and will require you to prove your identity with 2 pieces of approved photographic identification.) We will use reasonable efforts to supply, correct or delete personal information about you on our files.</p>

        <br />
        <p><strong>Third Party Websites</strong><br />
          The website contains links to other websites. We are not responsible for the privacy policies or practices of third party websites.</p>
      </div>
    </div>
  )
}

Privacy.layout = page => <Layout children={page} title="Privacy Policy" />

export default Privacy
