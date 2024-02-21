import React from 'react';
import { LayoutSingleColumn, Page } from '../../components';
import { InlineWidget } from 'react-calendly';
import SectionHero from './SectionHero';
import brandImage from '../../assets/free-consultation-banner.png';
import brandImageMob from '../../assets/free-consultation-banner-mobile.png';
import profile from '../../assets/tib-profile.jpeg';
import FooterContainer from '../FooterContainer/FooterContainer';

const FreeConsultation = props => {
  const {
    scrollingDisabled,
    schemaPriceMaybe,
    schemaAvailability,
    css,
    topbar,
    listingId,
    listingSlug,
    listingPathParamType,
    listingTab,
  } = props;
  const width = typeof window !== 'undefined' && window.innerWidth;
  return (
    <Page
      title={''}
      scrollingDisabled={scrollingDisabled}
      author={''}
      description={''}
      facebookImages={''}
      twitterImages={''}
      schema={{
        '@context': 'http://schema.org',
        '@type': 'Product',
        description: '',
        name: '',
        image: '',
        offers: {
          '@type': 'Offer',
          url: '',
          ...schemaPriceMaybe,
          availability: schemaAvailability,
        },
      }}
    >
      <LayoutSingleColumn className={css.pageRoot} topbar={topbar} footer={<FooterContainer />}>
        {width > 768 ? (
          <div className={css.banner}>
            <img src={brandImage} width={'100%'} />
          </div>
        ) : (
          <div className={css.banner}>
            <img src={brandImageMob} width={'100%'} />
          </div>
        )}
        <div className={css.providerProfileWrapper}>
          <div className={css.providerProfile}>
            <div className={css.sectionLeft}>
              <section>
                {/* <h2 className={css.heading}>Therapy for the globalized South Asain</h2> */}
                <div>
                  <p className={css.para}>
                    Our Founder Jasmyn Rana is currently running matching consultations herself.
                    This is because finding the right match is the most integral part of your
                    healing journey. Book with Jasmyn to get matched to a South Asian therapist that
                    is best suited to you and your path.
                  </p>
                </div>
              </section>
            </div>
            <div className={css.sectionRight}>
              <section>
                <img className={css.image} src={profile}></img>
              </section>
            </div>
          </div>
        </div>

        <div className={css.wrapperCalender}>
          <h2 className={css.heading}>Hello, Let’s Talk !</h2>
          <p className={css.para}>
            Schedule a 30 min one-to-one call to discuss your goals and challenges
          </p>
          <InlineWidget
            url="https://calendly.com/jasmynrana-therapy/therapy-session?month=2024-01"
            styles={{
              flex: 1,
              minHeight: '660px',
              width: '100%',
              padding: 0,
            }}
            pageSettings={{
              // backgroundColor: 'ffffff',
              hideEventTypeDetails: true,
              hideLandingPageDetails: true,
              primaryColor: '#000',
              textColor: '#000',
            }}
          ></InlineWidget>
        </div>
      </LayoutSingleColumn>
    </Page>
  );
};

export default FreeConsultation;
