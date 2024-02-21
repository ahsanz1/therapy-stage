import React, { Component } from 'react';

import { PrimaryButton } from '../Button/Button';
import CustomModal from '../CustomeModal';

const TermsModal = ({
  isModal = false,
  onManageDisableScrolling,
  currentCheckbox,
  onCloseModal,
  css,
  setIsCheckboxCheck,
  isCheckboxCheck,
}) => {
  const width = typeof window !== 'undefined' && window.innerWidth;

  const renderAcceptButton = () => {
    return (
      <PrimaryButton
        className={css.submitButton}
        data-position-style={
          currentCheckbox === 'termsCondition' || currentCheckbox === 'termsServices'
        }
        type={'button'}
        onClick={() => {
          currentCheckbox === 'termsCondition'
            ? setIsCheckboxCheck({
                ...isCheckboxCheck,
                termsCondition: true,
              })
            : currentCheckbox === 'termsServices'
            ? setIsCheckboxCheck({
                ...isCheckboxCheck,
                termsServices: true,
              })
            : null;
          onCloseModal && onCloseModal();
        }}
      >
        Accept
      </PrimaryButton>
    );
  };

  return (
    <CustomModal
      id="termsAndCon"
      //   containerClassName={css.modalContainer}
      //   contentClassName={css.contentClassName}
      isOpen={isModal}
      onClose={() => {
        onCloseModal && onCloseModal();
      }}
      //   usePortal
      //   onManageDisableScrolling={onManageDisableScrolling}
    >
      <div
      // className={
      //   currentCheckbox === 'termsCondition' ? css.termsAndConWrapper : css.termsServicesWrapper
      // }
      >
        {currentCheckbox === 'termsCondition' ? (
          <div className={css.innerContent}>
            <h3>Terms and Conditions</h3>
            <p>
              The following are the Terms and Conditions (the "Agreement") which govern your access
              and use of our online platform through which therapy may be provided (collectively the
              "Platform"). This website is owned and operated by THERAPY IS BROWN located at 16-18
              Umah Street, Cornubia, 4130, QLD. The platform may be provided or be accessible via
              multiple websites or applications whether owned and/or operated by us or by third
              parties, including, without limitation, the website www.therapyisbrown.com and its
              related apps and social media platforms. By accessing or using the Platform, you are
              entering into this agreement. You should read this agreement carefully before starting
              to use the Platform. If you do not agree to be bound to any term of this agreement,
              you must not access the Platform. When the terms "we", "us", "our" or similar are used
              in this Agreement, they refer to any company that owns and operates the Platform (the
              "Company"). IMPORTANT NOTICE: THIS AGREEMENT IS SUBJECT TO BINDING ARBITRATION AND A
              CLASS ACTION WAIVER AS DETAILED IN SECTION 6.
            </p>
            <h4>The Therapists and Therapist Services</h4>
            <p>
              The Platform may be used to connect you with a Therapist who will provide services to
              you through the Platform ("Therapist Services"). Our Therapists are located in many
              different regions. We require every Therapist providing Therapist Services on the
              Platform to have adequate training in the field of counseling for their jurisdiction
              which will be visible to the client. However, if a therapist is based in a
              jurisdiction where no licensing, or similar, is required and/or available, then the
              Platform ensures the balance requirements are met. Therapists must have a relevant
              academic qualification in their field, with reasonable experience, and have to be
              qualified and certified by their respective professional board after successfully
              completing the necessary education, exams, training and practice requirements if
              applicable. The Therapists are independent providers who are neither our employees nor
              agents nor representatives. The Platform's role is limited to clients with Therapist
              Services. The Therapists themselves are responsible for the performance of the
              Therapist Services and the following:
            </p>
            <p>
              1. The proper provision on services to clients; <br />
              <br /> 2. Take all reasonable steps to ensure that the client does not suffer
              physical, emotional, or psychological harm during counseling sessions or as an outcome
              of counseling sessions. ii. Counselors must not exploit their clients financially,
              sexually, emotionally, or in any other way. <br />
              <br />
              3. Offer a non-judgmental professional service: free from discrimination and honouring
              the individuality of the client;
              <br /> <br />
              4. Establish a helping relationship, in order to maintain the integrity and
              empowerment of the client, without offering advice; <br />
              <br />
              5. Be committed to ongoing personal and professional development.
              <br /> <br />
              6. Be responsible for your own updating and continued knowledge of theories, ethics,
              and practices: through journals, the association, and other relevant bodies. 7.
              Undertake regular supervision and debriefing to develop skills, monitor performance,
              and sustain professional accountability.
              <br />
              <br />
              8. Ensure client understanding of the purpose, process, and boundaries of the
              counseling relationship.
              <br />
              <br />
              9. Offer a promise of confidentiality and explain the limits of duty of care.
              <br />
              <br />
              10. For the purpose of advocacy, receive written permission from the client before
              divulging any information or contacting other parties.
              <br />
              <br />
              11. Endeavour to make suitable referral where competent service cannot be provided.
              <br />
              <br />
              12. Not provide legal advice and guidance on matters of law, nor practice as legal
              counsel on behalf of or to a client, when practicing as a counselor.
              <br />
              <br />
              13. Not act as an agent for a client.
              <br />
              <br />
              14. Not initiate, develop, or pursue a relationship, be it sexual or nonsexual, with
              past or current clients, within 2 years of the last counseling session.
              <br />
              <br />
              15. Be committed to their respective code of ethics.
              <br />
              <br />
              16. To keep all client records safe and secure
              <br />
              <br />
              17. Clinical/therapeutic decisions in their work with clients
              <br />
              <br />
              18. Must take all reasonable steps to ensure that the client does not suffer physical,
              emotional, or psychological harm during counseling sessions or as an outcome of
              counseling sessions
              <br />
              <br />
              19. Must not exploit their clients financially, sexually, emotionally, or in any other
              way. Suggesting or engaging in sexual activity with a client is unethical.
              <br />
              <br />
              20. Must provide privacy for counseling sessions. The sessions should not be
              overheard, recorded, or observed by anyone other than the Counsellor, without informed
              consent from the client. Normally any recording would be discussed as part of the
              contract. Care must be taken that sessions are not interrupted.
              <br />
              <br />
              21. Must not normally act on behalf of their clients. If they do, it will only be with
              express written consent of their client, or else in exceptional circumstances
              <br />
              <br />
              22. Must not give advice; 23. Have a responsibility to establish with clients, at the
              outset of counseling, the existence of any other therapeutic or helping relationships
              in which the client is involved; and to consider whether counseling is appropriate.
              Counselors should gain the client's permission before conferring in any way with other
              professional workers
              <br />
              <br />
              24. Not engage in negligent, criminal, discreditable conduct or other improper conduct
              with respect to the client or otherwise. 25. Definition of Client: To avoid any doubt,
              "Client" refers to a party or parties engaged in a counseling service, encompassing
              counseling, supervising, teaching, research, and professional practice in counseling.
              Clients may include individuals, couples, families, groups, organizations,
              communities, facilitators, sponsors, or those commissioning or paying for professional
              activity.
              <br />
              <br />
              26. Changing Therapists: If the Therapist Services provided by the Therapist do not
              meet your needs or expectations, you have the option to switch to a different
              Therapist available on the Platform. In the event that a connected Therapist ceases to
              use the Platform, we will notify you via email, providing an opportunity to match with
              a new Therapist.
              <br />
              <br />
              27. Limitations of Therapist Services: While the Therapist Services aim to be
              beneficial, it is understood, agreed, and acknowledged that they may not be suitable
              for everyone's needs. These services may not be appropriate for every situation and
              are not a substitute for certain mental health needs that may require in-person
              therapy services, such as active withdrawal from substances or anorexia nervosa.
              <br />
              <br />
              28. Emergency Situations: In cases of suicidal thoughts, harm to oneself or others, or
              any perceived danger, or in the event of a medical emergency, you must immediately
              call your local emergency services number and notify the relevant authorities. The
              Platform is not designed for use in emergencies, and Therapists cannot provide
              assistance in such cases.
              <br />
              <br />
              29. Clinical Diagnosis and Official Documentation: The Platform is not intended for
              the provision of clinical diagnosis requiring an in-person evaluation. It should not
              be used for obtaining official documentation or approvals, including court-ordered
              therapy or emotional service dog certification. The Platform is also not intended for
              providing information on appropriate drugs or medical treatments.
              <br />
              <br />
              30. In-Person Care: Do not disregard, avoid, or delay in obtaining in-person care from
              your doctor or other qualified professional based on information or advice received
              through the Platform.
            </p>
            <h4>Privacy and Security</h4>
            <p>
              Protecting and safeguarding any information you provide through the Platform is of
              utmost importance to us. Detailed information about our security and privacy practices
              can be found in our Privacy Policy, accessible at XXXXXXXXX.com/privacy (referred to
              as the 'Privacy Policy'). By agreeing to this Agreement and/or by using the Platform,
              you are also consenting to the terms outlined in the Privacy Policy. The Privacy
              Policy is incorporated into and deemed a part of this Agreement. The same rules that
              apply regarding changes and revisions of this Agreement also apply to changes and
              revisions of the Privacy Policy.
            </p>
            <h4>Third Party Content</h4>
            <p>
              The Platform may contain other content, products or services which are offered or
              provided by third parties ("Third Party Content"), links to Third Party Content
              (including but not limited to links to other websites) or advertisements which are
              related to Third Party Content. We have no responsibility for the creation of any such
              Third Party Content, including (but not limited to) any related products, practices,
              terms or policies, and we will not be liable for any damage or loss caused by any
              Third Party Content.
            </p>
            <h4>Disclaimer of Warranty and Limitation of Liability</h4>
            <p>
              To the maximum extent permitted by law, you hereby release us and agree to remove
              liability from any and all causes of action and claims of any nature resulting from
              the Therapist Services or the Platform. This includes (without limitation) any act,
              omission, opinion, response, advice, suggestion, information, and/or service of any
              Therapist and/or any other content or information accessible through the Platform. You
              understand that beyond connecting you with Therapist Services, the Platform does not
              have any control over your relationship with your Therapist and is not liable for any
              conduct of the Therapist. You understand, agree, and acknowledge that the Platform is
              provided "as is" without any express or implied warranties of any kind, including but
              not limited to merchantability, non-infringement, security, fitness for a particular
              purpose, or accuracy. The use of the Platform is at your own risk. To the fullest
              extent of the law, we expressly disclaim all warranties of any kind, whether expressed
              or implied. You understand, agree, and acknowledge that we shall not be liable to you
              or to any third party for any indirect, incidental, consequential, special, punitive,
              or exemplary damages. If the applicable law does not allow the limitation of liability
              as set forth above, the limitation will be deemed modified solely to the extent
              necessary to comply with applicable law. This section (limitation of liability) shall
              survive the termination or expiration of this Agreement.
            </p>
            <h4>BILLING</h4>
            <p>
              The client is obliged to pay for each booking in advance at the time the session is
              booked online. If there is a failure in payment for reasons independent through no
              fault of the client or platform, the client undertakes to pay outstanding fees within
              7 days of the failure becoming apparent.
              <br />
              <br />
              <strong>Cancellation Policy:</strong> Any cancellations made within 24 hours will
              result in the client being charged in full without refund.
              <br />
              <br /> <strong>Therapist Unavailability:</strong> If a payment is made, and the
              Therapist is unable to perform the obligation, such as attending the booking, then the
              client will receive a refund within 30 business days.
              <h4>Your Account, Representations, Conduct and Commitments:</h4>
              <strong>Consent and Contractual Capacity:</strong> You confirm that you are legally
              able to consent to receive Therapist Services, or you have the consent of a parent or
              guardian, and are legally able to enter into a contract. <br />
              <br /> <strong>Minor Consent:</strong> Where consent from a parent or guardian is
              required for Therapist Services, you confirm that, as the consenting parent or
              guardian, you have the sole right to consent for the minor seeking therapy. You give
              affirmative consent to the Privacy Policy for the minor and agree that consent to
              Therapist Services remains valid until membership is canceled.
              <br />
              <br /> <strong> Accuracy of Information: </strong>You hereby confirm and agree that
              all the information that you provided in or through the Platform, and the information
              that you will provide in or through the Platform in the future, is accurate, true,
              current and complete. Furthermore, you agree that during the term of this Agreement
              you will make sure to maintain and update this information so it will continue to be
              accurate, You agree, confirm and acknowledge that you are responsible for maintaining
              the confidentiality of your password and any other security information related to
              your account (collectively "Account Access"). <br /> We advise you to change your
              password frequently and to take extra care in safeguarding your password. <br />
              <br /> You agree to notify us immediately of any unauthorized use of your Account
              Access or any other concern for breach of your account security. <br />
              <br /> You agree, confirm and acknowledge that we will not be liable for any loss or
              damage that incurred as a result of someone else using your account, either with or
              without your consent and/or knowledge. <br />
              <br /> You agree, confirm and acknowledge that you are solely and fully liable and
              responsible for all activities performed using your Account Access. <br />
              <br /> You further acknowledge and agree that we will hold you liable and responsible
              for any damage or loss incurred as a result of the use of your Account Access by any
              person whether authorized by you or not, and you agree to indemnify us for any such
              damage or loss. <br />
              <br /> You agree and commit not to use the account or Account Access of any other
              person for any reason. current and complete. You agree and confirm that your use of
              the Platform, including the Therapist Services, are for your own personal use only and
              that you are not using the Platform or the Therapist Services for or behalf of any
              other person or organization. <br />
              <br /> You agree and commit not to interfere with or disrupt, or attempt to interfere
              with or disrupt, any of our systems, services, servers, networks or infrastructure, or
              any of the Platform's systems, services, servers, networks or infrastructure,
              including without limitation obtaining unauthorized access to the aforementioned.{' '}
              <br />
              <br /> You agree and commit not to make any use of the Platform for the posting,
              sending or delivering of either of the following: (a) unsolicited email and/or
              advertisement or promotion of goods and services; (b) malicious software or code; (c)
              unlawful, harassing, privacy invading, abusive, threatening, vulgar, obscene, racist
              or potentially harmful content; (d) any content that infringes a third party right
              including intellectual property rights; (e) any content that may cause damage to a
              third party; (f) any content which may constitute, cause or encourage a criminal
              action or violate any applicable law.
              <br />
              <br /> You agree and commit not to violate any applicable local, state, national or
              international law, statute, ordinance, rule, regulation or ethical code in relation to
              your use of the Platform and your relationship with the Therapists and us. If you
              receive any file from us or from a Therapist, whether through the Platform or not, you
              agree to check and scan this file for any virus or malicious software prior to opening
              or using this file. You will indemnify us, defend us, and hold us harmless from and
              against any and all claims, losses, causes of action, demands, liabilities, costs or
              expenses (including, but not limited to, litigation and reasonable attorneys' fees and
              expenses) arising out of or relating to any of the following: (a) your access to or
              use of the Platform; (b) any actions made with your account or Account Access whether
              by you or by someone else; (c) your violation of any of the provisions of this
              Agreement; (d) non-payment for any of the services (including Therapist Services)
              which were provided through the Platform; (e) your violation of any third party right,
              including, without limitation, any intellectual property right, publicity,
              confidentiality, property or privacy right. This clause shall survive expiration or
              termination of this Agreement. You confirm and agree to use only credit cards or other
              payment means (collectively “Payment Means”) which you are duly and fully authorized
              to use, and that all payment related information that you provided and will provide in
              the future, to or through the Platform, is accurate, current and correct and will
              continue to be accurate, current and correct. <br />
              <br />
              You agree to pay all fees and charges associated with your account on a timely basis
              and according to the fees schedule, the terms and the rates as published in the
              Platform. By providing us with your Payment Means you authorize us to bill and charge
              you through that Payment Means and you agree to maintain valid Payment Means
              information in your account information. <br />
              <br />
              <h4>Modifications, Termination, Interruption and Disruptions to the Platform</h4> You
              understand, agree and acknowledge that we may modify, suspend, disrupt or discontinue
              the Platform, any part of the Platform or the use of the Platform, whether to all
              clients or to you specifically, at any time with or without notice to you. <br />
              <br />
              You agree and acknowledge that we will not be liable for any of the aforementioned
              actions or for any losses or damages that are caused by any of the aforementioned
              actions. The Platform depends on various factors such as software, hardware and tools,
              either our own or those owned and/or operated by our contractors and suppliers. While
              we make commercially reasonable efforts to ensure the Platform's reliability and
              accessibility, you understand and agree that no platform can be 100% reliable and
              accessible and so we cannot guarantee that access to the Platform will be
              uninterrupted or that it will be accessible, consistent, timely or error-free at all
              times.
              <h4>Notices</h4>
              We may provide notices or other communications to you regarding this Agreement or any
              aspect of the Platform, by email to the email address that we have on record, by
              regular mail or by posting it online. The date of receipt shall be deemed the date on
              which such notice is given. Notices sent to us must be delivered by email to
              contact@betterhelp.com. Notice to California Residents: <br />
              The Board of Behavioural Sciences receives and responds to complaints regarding
              services provided within the scope of practice of (marriage and family therapists,
              clinical social workers, or professional clinical therapists). You may contact the
              board online at www.bbs.ca.gov, or by calling (916) 574-7830.
              <h4>SEVERABILITY</h4>
              If any provision of this agreement is or becomes invalid or unenforceable then, if the
              provision can be read down to make it valid or enforceable without materially changing
              its effect, it must be read down, and otherwise the offending provision must be
              severed and the remaining provisions will operate as if the provision had not been
              included.
              <br />
              <br />
              <strong>Jurisdiction</strong>
              <br />
              This agreement is governed by the laws of Queensland, Australia and the parties will
              submit to the jurisdiction of the courts of this state.
              <br />
              <br />
              <strong>Important Notes about our Agreement</strong>
              <br />
              This Agreement and our relationship with you shall both be interpreted solely in
              accordance with the laws of the State of Delaware excluding any rules governing choice
              of laws.
              <br />
              THIS AGREEMENT CONSTITUTES THE ENTIRE AGREEMENT BETWEEN YOU AND US. YOU CONFIRM THAT
              YOU HAVE NOT RELIED UPON ANY PROMISES OR REPRESENTATIONS BY US EXCEPT AS SET FORTH IN
              THIS AGREEMENT. You irrevocably agree that the exclusive venue for any action or
              proceeding arising out of relating to this Agreement or our relationship with you,
              regardless of theory, shall be the US District Court for the Northern District of
              California, or the state courts located in Santa Clara County in California. You
              irrevocably consent to the personal jurisdiction of the aforementioned courts and
              hereby waive any objection to the exercise of jurisdiction by the aforementioned
              courts. Nothing in this Agreement, including the choice of the laws of the State of
              Delaware, affects your statutory rights as a consumer to rely on the mandatory
              consumer protection provisions contained in the law of the country in which you live.
              <br />
              <br />
              We may change this Agreement by posting modifications on the Platform. Unless
              otherwise specified by us, all modifications shall be effective upon posting.
              Therefore, you are encouraged to check the terms of this Agreement frequently. The
              last update date of this Agreement is posted at the bottom of the Agreement. By using
              the Platform after the changes become effective, you agree to be bound by such changes
              to the Agreement. If you do not agree to the changes, you must terminate access to the
              Platform and participation in its services.
              <br />
              <br />
              We may freely transfer or assign this Agreement or any of its obligations hereunder.
              The paragraph headings in this Agreement are solely for the sake of convenience and
              will not be applied in the interpretation of this Agreement.
              <br />
              <br />
              If any provision of this Agreement is held by a court of competent jurisdiction to be
              illegal, invalid, unenforceable, or otherwise contrary to law, the remaining
              provisions of this Agreement will remain in full force and effect.
              <br />
              <br />
              To clear any doubt, all clauses regarding arbitration, limitations of liabilities, and
              indemnification shall survive the termination or expiration of this Agreement.
            </p>
            {width < 1025 ? renderAcceptButton() : null}
          </div>
        ) : currentCheckbox === 'termsServices' ? (
          <div className={css.innerContent}>
            <h3>Terms of Service</h3>
            <p>
              Our sessions are 50 mins each. Initial consultations are free of charge and can be
              availed for 20 mins, but they can be used more than once with each service provider.
              We recommend trying to book your session/s at least one week in advance, and to book
              subsequent weeks in advance also if you want to keep your preferred slot. We have a 24
              hours cancellation policy. Sessions can be rescheduled if you notify us before the 24
              hour mark, otherwise they are charged in full. The reason for this is that it doesn’t
              allow us enough time to re-schedule with other client’s on waiting. Payments are made
              at the time of booking a session, if however there is a technical issue or special
              request we will try our best to accommodate this and bill you afterwards. The PACFA
              (Psychotherapy and Counselling Federation Australian) code of ethics are adhered to.
              Please read terms and conditions to understand our role as a secondary provider,
              liability and privacy.
            </p>
            {width < 1025 ? renderAcceptButton() : null}
          </div>
        ) : null}
        {width > 1024 ? (
          <PrimaryButton
            className={css.submitButton}
            data-position-style={
              currentCheckbox === 'termsCondition' || currentCheckbox === 'termsServices'
            }
            type={'button'}
            onClick={() => {
              currentCheckbox === 'termsCondition'
                ? setIsCheckboxCheck({
                    ...isCheckboxCheck,
                    termsCondition: true,
                  })
                : currentCheckbox === 'termsServices'
                ? setIsCheckboxCheck({
                    ...isCheckboxCheck,
                    termsServices: true,
                  })
                : null;
              onCloseModal && onCloseModal();
            }}
          >
            Accept
          </PrimaryButton>
        ) : null}
      </div>
    </CustomModal>
  );
};

export default TermsModal;
