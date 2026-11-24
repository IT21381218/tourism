import { useEffect, useState } from 'react';
import './App.css';
import { business } from './config/business';
import { destinations, experiences, galleryImages, tours } from './data/content';
import { copy } from './i18n/translations';

const imageUrl = (id, width = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;

function Icon({ name, size = 20 }) {
  const paths = {
    arrow: <><path d="M4 12h15" /><path d="m13 5 7 7-7 7" /></>,
    menu: <><path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" /></>,
    close: <><path d="m18 6-12 12" /><path d="m6 6 12 12" /></>,
    pin: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    leaf: <><path d="M20 4c-9 0-15 4-15 11a5 5 0 0 0 5 5c7 0 11-6 10-16Z" /><path d="M4 21c3-5 7-8 12-11" /></>,
    compass: <><circle cx="12" cy="12" r="9" /><path d="m15.7 8.3-2.1 5.3-5.3 2.1 2.1-5.3 5.3-2.1Z" /></>,
  };
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

function App() {
  const [language, setLanguage] = useState('en');
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeTour, setActiveTour] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [validationRequested, setValidationRequested] = useState(false);
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', country: '', language: 'en', arrival: '', departure: '',
    flexible: false, adults: '2', children: '0', interests: [], style: '',
    destinations: '', accommodation: '', budget: '', message: '',
  });

  const t = copy[language];
  const nav = [
    ['about', t.nav.about],
    ['destinations', t.nav.destinations],
    ['tours', t.nav.tours],
    ['experiences', t.nav.experiences],
    ['journal', t.nav.journal],
    ['gallery', t.nav.gallery],
    ['contact', t.nav.contact],
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === 'ja' ? 'ja' : 'en';
    document.title = t.seo.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.seo.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', t.seo.title);
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', t.seo.description);
  }, [language, t.seo.description, t.seo.title]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setActiveTour(null);
        setActiveImage(null);
        setMenuOpen(false);
      }
      if (activeImage !== null && event.key === 'ArrowRight') {
        setActiveImage((activeImage + 1) % galleryImages.length);
      }
      if (activeImage !== null && event.key === 'ArrowLeft') {
        setActiveImage((activeImage - 1 + galleryImages.length) % galleryImages.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImage]);

  const updateForm = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const toggleInterest = (interest) => {
    setForm((current) => ({
      ...current,
      interests: current.interests.includes(interest)
        ? current.interests.filter((item) => item !== interest)
        : [...current.interests, interest],
    }));
  };
  const validateStep = () => {
    if (step === 0) return Boolean(form.name.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email));
    if (step === 1) return form.flexible || Boolean(form.arrival && form.departure && form.departure >= form.arrival);
    if (step === 2) return Number(form.adults) > 0 && Number(form.children) >= 0;
    if (step === 4) return Boolean(form.style);
    return true;
  };
  const nextStep = (event) => {
    event.preventDefault();
    if (!validateStep()) {
      setValidationRequested(true);
      return;
    }
    setValidationRequested(false);
    setStep((current) => Math.min(current + 1, 6));
  };
  const changeLanguage = (nextLanguage) => {
    setLanguage(nextLanguage);
    updateForm('language', nextLanguage);
  };

  return (
    <div className="site-shell">
      <header className={`site-header ${scrolled ? 'is-scrolled' : ''} ${menuOpen ? 'menu-is-open' : ''}`}>
        <a className="wordmark" href="#home" onClick={() => setMenuOpen(false)} aria-label={`${business.brand} home`}>
          <span className="wordmark-mark"><Icon name="leaf" size={22} /></span>
          <span>{business.brand}<small>{t.brandLine}</small></span>
        </a>
        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label={t.navLabel}>
          {nav.map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>
          ))}
          <div className="mobile-language">
            <LanguageSwitch language={language} onChange={changeLanguage} />
          </div>
          <a className="mobile-cta" href="#contact" onClick={() => setMenuOpen(false)}>{t.planJourney}</a>
        </nav>
        <div className="header-actions">
          <LanguageSwitch language={language} onChange={changeLanguage} />
          <a className="button button-dark header-cta" href="#contact">{t.planJourney}</a>
        </div>
        <button className="menu-toggle" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? t.closeMenu : t.openMenu} aria-expanded={menuOpen}>
          <Icon name={menuOpen ? 'close' : 'menu'} />
        </button>
      </header>

      <main>
        <section className="hero" id="home">
          <div className="hero-image" role="img" aria-label={t.heroImageAlt} />
          <div className="hero-shade" />
          <div className="hero-grid">
            <div className="hero-content">
              <p className="eyebrow eyebrow-light">{t.hero.kicker}</p>
              <h1>{t.hero.titleLineOne}<br />{t.hero.titleLineTwo}</h1>
              <p className="hero-copy">{t.hero.description}</p>
              <div className="hero-actions">
                <a className="button button-light" href="#tours">{t.hero.explore}<Icon name="arrow" size={17} /></a>
                <a className="text-link text-link-light" href="#contact">{t.hero.plan}<span aria-hidden="true">↗</span></a>
              </div>
            </div>
            <div className="hero-caption"><span>{t.hero.caption}</span><span>06° 55' N&nbsp; 79° 51' E</span></div>
            <a className="scroll-cue" href="#about"><span />{t.scroll}</a>
          </div>
        </section>

        <section className="intro section-wrap" id="about">
          <div className="intro-top">
            <p className="eyebrow">{t.intro.kicker}</p>
            <h2>{t.intro.titleOne}<br /><em>{t.intro.titleTwo}</em></h2>
          </div>
          <div className="intro-bottom">
            <div className="intro-image image-frame">
              <img src={imageUrl('photo-1500530855697-b586d89ba3ee')} alt={t.intro.imageAlt} loading="lazy" />
              <span className="image-note">{t.intro.imageNote}</span>
            </div>
            <div className="intro-text">
              <p>{t.intro.description}</p>
              <p>{t.intro.localNote}</p>
              <a className="text-link" href="#host">{t.intro.link}<Icon name="arrow" size={17} /></a>
              <div className="intro-coordinate">AN ISLAND OF MANY WORLDS<br />7° 52' N&nbsp; 80° 46' E</div>
            </div>
          </div>
        </section>

        <section className="diversity section-wrap section-beige" id="destinations">
          <div className="section-heading">
            <div><p className="eyebrow">{t.destinations.kicker}</p><h2>{t.destinations.title}</h2></div>
            <p className="section-lead">{t.destinations.description}</p>
          </div>
          <div className="destination-grid">
            {destinations.map((destination, index) => (
              <a className={`destination-card destination-card-${index + 1}`} href="#contact" key={destination.id}>
                <img src={imageUrl(destination.image, 900)} alt={t.destinationCards[destination.id].alt} loading="lazy" />
                <span className="destination-shade" />
                <span className="destination-index">0{index + 1}</span>
                <span className="destination-copy">
                  <small>{t.destinationCards[destination.id].region}</small>
                  <strong>{t.destinationCards[destination.id].title}</strong>
                  <span>{t.destinationCards[destination.id].description}</span>
                </span>
                <span className="destination-arrow"><Icon name="arrow" size={18} /></span>
              </a>
            ))}
          </div>
          <div className="center-link"><a className="text-link" href="#contact">{t.destinations.explore}<Icon name="arrow" size={17} /></a></div>
        </section>

        <section className="tours section-wrap" id="tours">
          <div className="section-heading">
            <div><p className="eyebrow">{t.tours.kicker}</p><h2>{t.tours.title}</h2></div>
            <p className="section-lead">{t.tours.description}</p>
          </div>
          <div className="tour-grid">
            {tours.map((tour, index) => {
              const details = t.tours.tourCards[tour.id];
              return (
                <article className={`tour-card tour-card-${index + 1}`} key={tour.id}>
                  <button className="tour-image" onClick={() => setActiveTour(tour.id)} aria-label={`${t.tours.viewJourney}: ${details.title}`}>
                    <img src={imageUrl(tour.image, 1000)} alt={details.alt} loading="lazy" />
                    <span className="tour-number">0{index + 1}</span>
                    <span className="tour-duration">{details.duration}</span>
                  </button>
                  <div className="tour-info">
                    <h3>{details.title}</h3>
                    <p>{details.description}</p>
                    <div className="tour-tags">{details.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                    <div className="tour-links">
                      <button className="text-link" onClick={() => setActiveTour(tour.id)}>{t.tours.viewJourney}<Icon name="arrow" size={16} /></button>
                      <a href="#contact">{t.tours.requestQuote}</a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          <p className="pricing-note">{t.tours.pricingNote}</p>
        </section>

        <section className="private-experience">
          <div className="private-image"><img src={imageUrl('photo-1516026672322-bc52d61a55d5')} alt={t.privateTour.imageAlt} loading="lazy" /></div>
          <div className="private-copy">
            <p className="eyebrow eyebrow-light">{t.privateTour.kicker}</p>
            <h2>{t.privateTour.titleOne}<br /><em>{t.privateTour.titleTwo}</em></h2>
            <p className="private-description">{t.privateTour.description}</p>
            <ul className="private-list">
              {t.privateTour.benefits.map((benefit, index) => <li key={benefit}><span>0{index + 1}</span>{benefit}</li>)}
            </ul>
            <a className="text-link text-link-light" href="#contact">{t.privateTour.link}<Icon name="arrow" size={17} /></a>
          </div>
        </section>

        <section className="experiences section-wrap" id="experiences">
          <div className="section-heading">
            <div><p className="eyebrow">{t.experiences.kicker}</p><h2>{t.experiences.title}</h2></div>
            <p className="section-lead">{t.experiences.description}</p>
          </div>
          <div className="experience-grid">
            {experiences.map((experience, index) => (
              <a className="experience-card" href="#contact" key={experience.id}>
                <img src={imageUrl(experience.image, 850)} alt={t.experienceCards[experience.id].alt} loading="lazy" />
                <span className="experience-overlay" />
                <span className="experience-index">0{index + 1}</span>
                <span className="experience-name">{t.experienceCards[experience.id].title}<Icon name="arrow" size={17} /></span>
              </a>
            ))}
          </div>
        </section>

        <section className="reasons section-wrap section-beige">
          <div className="section-heading">
            <div><p className="eyebrow">{t.reasons.kicker}</p><h2>{t.reasons.title}</h2></div>
            <p className="section-lead">{t.reasons.description}</p>
          </div>
          <div className="reason-grid">
            {t.reasons.items.map((item, index) => (
              <article className="reason-item" key={item.title}>
                <span className="reason-icon"><Icon name={['leaf', 'compass', 'pin', 'arrow', 'leaf', 'compass'][index]} size={23} /></span>
                <span className="reason-number">0{index + 1}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="host section-wrap" id="host">
          <div className="host-photo">
            <img src={imageUrl('photo-1510414842594-a61c69b5ae57')} alt={t.host.imageAlt} loading="lazy" />
            <span className="host-photo-note">{t.host.photoNote}</span>
          </div>
          <div className="host-copy">
            <p className="eyebrow">{t.host.kicker}</p>
            <h2>{t.host.titleOne}<br /><em>{t.host.titleTwo}</em></h2>
            <p>{t.host.description}</p>
            <p>{t.host.disclaimer}</p>
            <a className="text-link" href="#contact">{t.host.link}<Icon name="arrow" size={17} /></a>
          </div>
        </section>

        <section className="inspiration">
          <img src={imageUrl('photo-1500534623283-312aade485b7', 1800)} alt={t.inspiration.imageAlt} loading="lazy" />
          <div className="inspiration-shade" />
          <div className="inspiration-copy"><p className="eyebrow eyebrow-light">{t.inspiration.kicker}</p><h2>{t.inspiration.titleOne}<br /><em>{t.inspiration.titleTwo}</em></h2><a className="text-link text-link-light" href="#gallery">{t.inspiration.link}<Icon name="arrow" size={17} /></a></div>
        </section>

        <section className="journal section-wrap" id="journal">
          <div className="section-heading">
            <div><p className="eyebrow">{t.journal.kicker}</p><h2>{t.journal.title}</h2></div>
            <p className="section-lead">{t.journal.description}</p>
          </div>
          <div className="journal-grid">
            {t.journal.articles.map((article, index) => (
              <a className="journal-card" href="#contact" key={article.title}>
                <div className={`journal-image journal-image-${index + 1}`}><img src={imageUrl(['photo-1516026672322-bc52d61a55d5', 'photo-1500530855697-b586d89ba3ee', 'photo-1555939594-58d7cb561ad1'][index], 850)} alt={article.alt} loading="lazy" /></div>
                <span className="journal-meta">{article.category}<span>{article.readTime}</span></span>
                <h3>{article.title}</h3>
                <span className="text-link">{t.journal.readArticle}<Icon name="arrow" size={16} /></span>
              </a>
            ))}
          </div>
        </section>

        <section className="testimonials section-beige">
          <div className="testimonial-inner">
            <p className="eyebrow">{t.testimonials.kicker}</p>
            <h2>{t.testimonials.titleOne}<br /><em>{t.testimonials.titleTwo}</em></h2>
            <p>{t.testimonials.description}</p>
            <div className="testimonial-placeholder"><span>“</span>{t.testimonials.placeholder}</div>
          </div>
        </section>

        <section className="gallery section-wrap" id="gallery">
          <div className="section-heading">
            <div><p className="eyebrow">{t.gallery.kicker}</p><h2>{t.gallery.title}</h2></div>
            <p className="section-lead">{t.gallery.description}</p>
          </div>
          <div className="gallery-grid">
            {galleryImages.map((item, index) => (
              <button className={`gallery-tile gallery-tile-${index + 1}`} key={item.image} onClick={() => setActiveImage(index)} aria-label={`${t.gallery.openImage}: ${t.gallery.items[index]}`}>
                <img src={imageUrl(item.image, 900)} alt={t.gallery.items[index]} loading="lazy" />
                <span>{t.gallery.items[index]}</span>
              </button>
            ))}
          </div>
          <p className="gallery-caption">{t.gallery.caption}</p>
        </section>

        <section className="contact-cta" id="contact">
          <div className="contact-image"><img src={imageUrl('photo-1500375592092-40eb2168fd21', 1800)} alt={t.contact.imageAlt} loading="lazy" /></div>
          <div className="contact-shade" />
          <div className="contact-content">
            <p className="eyebrow eyebrow-light">{t.contact.kicker}</p>
            <h2>{t.contact.titleOne}<br /><em>{t.contact.titleTwo}</em></h2>
            <p>{t.contact.description}</p>
            <a className="button button-light" href="#inquiry">{t.contact.cta}<Icon name="arrow" size={17} /></a>
          </div>
        </section>

        <section className="inquiry section-wrap" id="inquiry">
          <div className="inquiry-intro">
            <p className="eyebrow">{t.inquiry.kicker}</p>
            <h2>{t.inquiry.titleOne}<br /><em>{t.inquiry.titleTwo}</em></h2>
            <p>{t.inquiry.description}</p>
            <div className="contact-details">
              <span><Icon name="pin" size={18} />{t.inquiry.location}</span>
              <span>{t.inquiry.contactPlaceholder}</span>
            </div>
            {business.whatsappNumber && <a className="text-link" href={`https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(t.whatsappMessage)}`} target="_blank" rel="noreferrer">{t.inquiry.whatsapp}<Icon name="arrow" size={17} /></a>}
          </div>
          <div className="inquiry-form-wrap">
            {submitted ? (
              <div className="form-success" role="status">
                <span className="success-mark">✓</span>
                <p className="eyebrow">{t.inquiry.successKicker}</p>
                <h3>{t.inquiry.successTitle}</h3>
                <p>{t.inquiry.successDescription}</p>
                <button className="text-link" onClick={() => { setSubmitted(false); setStep(0); }}>{t.inquiry.startAgain}<Icon name="arrow" size={17} /></button>
              </div>
            ) : (
              <form className="inquiry-form" onSubmit={step < 6 ? nextStep : (event) => { event.preventDefault(); setSubmitted(true); }}>
                <div className="form-progress">
                  <span>{step === 6 ? t.inquiry.reviewLabel : `${t.inquiry.stepLabel} ${String(step + 1).padStart(2, '0')} / 06`}</span>
                  <span>{step === 6 ? '100%' : `${Math.round(((step + 1) / 6) * 100)}%`}</span>
                  <div className="progress-track"><span style={{ width: `${step === 6 ? 100 : ((step + 1) / 6) * 100}%` }} /></div>
                </div>
                {step < 6 ? <InquiryStep step={step} form={form} t={t} updateForm={updateForm} toggleInterest={toggleInterest} /> : <ReviewStep form={form} t={t} />}
                <div className="form-footer">
                  {step > 0 && <button className="form-back" type="button" onClick={() => setStep((current) => current - 1)}>{t.inquiry.back}</button>}
                  <span className="form-error" aria-live="polite">{validationRequested && !validateStep() ? t.inquiry.validation[step] : ''}</span>
                  <button className="button button-dark" type="submit">{step === 6 ? t.inquiry.submit : t.inquiry.continue}<Icon name="arrow" size={16} /></button>
                </div>
                <p className="form-disclaimer">{t.inquiry.disclaimer}</p>
              </form>
            )}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-main">
          <a className="wordmark footer-wordmark" href="#home"><span className="wordmark-mark"><Icon name="leaf" size={22} /></span><span>{business.brand}<small>{t.brandLine}</small></span></a>
          <p>{t.footer.message}</p>
          <div className="footer-nav">{nav.slice(0, 4).map(([id, label]) => <a href={`#${id}`} key={id}>{label}</a>)}</div>
          <a className="footer-top" href="#home">{t.footer.backToTop}<span>↑</span></a>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} {business.brand}. {t.footer.rights}</span><span>{t.footer.localNote}</span><span>{t.footer.contactPlaceholder}</span></div>
      </footer>

      {business.whatsappNumber && <a className="whatsapp-float" href={`https://wa.me/${business.whatsappNumber}?text=${encodeURIComponent(t.whatsappMessage)}`} target="_blank" rel="noreferrer" aria-label={t.whatsappLabel}>wa</a>}

      {activeTour && <TourDialog tour={tours.find((tour) => tour.id === activeTour)} copy={t} onClose={() => setActiveTour(null)} />}
      {activeImage !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={t.gallery.lightboxLabel} onClick={() => setActiveImage(null)}>
          <button className="lightbox-close" onClick={() => setActiveImage(null)} aria-label={t.close}><Icon name="close" size={26} /></button>
          <button className="lightbox-prev" onClick={(event) => { event.stopPropagation(); setActiveImage((activeImage - 1 + galleryImages.length) % galleryImages.length); }} aria-label={t.gallery.previous}>←</button>
          <img src={imageUrl(galleryImages[activeImage].image, 1800)} alt={t.gallery.items[activeImage]} onClick={(event) => event.stopPropagation()} />
          <button className="lightbox-next" onClick={(event) => { event.stopPropagation(); setActiveImage((activeImage + 1) % galleryImages.length); }} aria-label={t.gallery.next}>→</button>
          <p>{t.gallery.items[activeImage]}</p>
        </div>
      )}
    </div>
  );
}

function LanguageSwitch({ language, onChange }) {
  return (
    <div className="language-switch" role="group" aria-label={language === 'ja' ? '言語を選択' : 'Select language'}>
      <button className={language === 'en' ? 'selected' : ''} onClick={() => onChange('en')} aria-pressed={language === 'en'}>EN</button>
      <span>/</span>
      <button className={language === 'ja' ? 'selected' : ''} onClick={() => onChange('ja')} aria-pressed={language === 'ja'}>日本語</button>
    </div>
  );
}

function InquiryStep({ step, form, t, updateForm, toggleInterest }) {
  const Field = ({ label, name, type = 'text', required = false, ...props }) => (
    <label className="form-field">{label}{required && <span className="required-mark"> *</span>}
      <input type={type} value={form[name]} onChange={(event) => updateForm(name, event.target.value)} required={required} {...props} />
    </label>
  );
  if (step === 0) return <div className="step-content"><p className="eyebrow">{t.inquiry.steps[0].kicker}</p><h3>{t.inquiry.steps[0].title}</h3><div className="form-grid"><Field label={t.inquiry.fields.name} name="name" required autoComplete="name" /><Field label={t.inquiry.fields.email} name="email" type="email" required autoComplete="email" /><Field label={t.inquiry.fields.country} name="country" autoComplete="country-name" /><label className="form-field">{t.inquiry.fields.language}<select value={form.language} onChange={(event) => updateForm('language', event.target.value)}><option value="en">{t.languages.en}</option><option value="ja">{t.languages.ja}</option></select></label></div></div>;
  if (step === 1) return <div className="step-content"><p className="eyebrow">{t.inquiry.steps[1].kicker}</p><h3>{t.inquiry.steps[1].title}</h3><div className="form-grid"><Field label={t.inquiry.fields.arrival} name="arrival" type="date" disabled={form.flexible} /><Field label={t.inquiry.fields.departure} name="departure" type="date" min={form.arrival || undefined} disabled={form.flexible} /></div><label className="check-option"><input type="checkbox" checked={form.flexible} onChange={(event) => updateForm('flexible', event.target.checked)} /><span>{t.inquiry.fields.flexible}</span></label></div>;
  if (step === 2) return <div className="step-content"><p className="eyebrow">{t.inquiry.steps[2].kicker}</p><h3>{t.inquiry.steps[2].title}</h3><div className="form-grid form-grid-narrow"><Field label={t.inquiry.fields.adults} name="adults" type="number" min="1" max="30" required /><Field label={t.inquiry.fields.children} name="children" type="number" min="0" max="30" /></div></div>;
  if (step === 3) return <div className="step-content"><p className="eyebrow">{t.inquiry.steps[3].kicker}</p><h3>{t.inquiry.steps[3].title}</h3><div className="choice-grid">{t.inquiry.interests.map((interest) => <button type="button" className={`choice-chip ${form.interests.includes(interest) ? 'is-selected' : ''}`} key={interest} onClick={() => toggleInterest(interest)} aria-pressed={form.interests.includes(interest)}>{interest}</button>)}</div></div>;
  if (step === 4) return <div className="step-content"><p className="eyebrow">{t.inquiry.steps[4].kicker}</p><h3>{t.inquiry.steps[4].title}</h3><div className="choice-grid choice-grid-single">{t.inquiry.styles.map((style) => <label className={`radio-card ${form.style === style ? 'is-selected' : ''}`} key={style}><input type="radio" name="style" value={style} checked={form.style === style} onChange={() => updateForm('style', style)} /><span>{style}</span><span className="radio-dot" /></label>)}</div></div>;
  return <div className="step-content"><p className="eyebrow">{t.inquiry.steps[5].kicker}</p><h3>{t.inquiry.steps[5].title}</h3><div className="form-grid"><label className="form-field form-field-wide">{t.inquiry.fields.destinations}<textarea rows="2" value={form.destinations} onChange={(event) => updateForm('destinations', event.target.value)} /></label><label className="form-field">{t.inquiry.fields.accommodation}<select value={form.accommodation} onChange={(event) => updateForm('accommodation', event.target.value)}><option value="">{t.inquiry.fields.select}</option>{t.inquiry.accommodationOptions.map((option) => <option value={option} key={option}>{option}</option>)}</select></label><Field label={t.inquiry.fields.budget} name="budget" /><label className="form-field form-field-wide">{t.inquiry.fields.message}<textarea rows="3" value={form.message} onChange={(event) => updateForm('message', event.target.value)} /></label></div></div>;
}

function ReviewStep({ form, t }) {
  const rows = [
    [t.inquiry.fields.name, form.name],
    [t.inquiry.fields.email, form.email],
    [t.inquiry.fields.country, form.country || t.inquiry.notProvided],
    [t.inquiry.fields.dates, form.flexible ? t.inquiry.flexibleDates : `${form.arrival || '—'} – ${form.departure || '—'}`],
    [t.inquiry.fields.travelers, `${form.adults} ${t.inquiry.fields.adults.toLowerCase()}, ${form.children} ${t.inquiry.fields.children.toLowerCase()}`],
    [t.inquiry.fields.interests, form.interests.join(', ') || t.inquiry.notProvided],
    [t.inquiry.fields.style, form.style],
    [t.inquiry.fields.destinations, form.destinations || t.inquiry.notProvided],
    [t.inquiry.fields.accommodation, form.accommodation || t.inquiry.notProvided],
    [t.inquiry.fields.budget, form.budget || t.inquiry.notProvided],
    [t.inquiry.fields.message, form.message || t.inquiry.notProvided],
  ];
  return <div className="step-content review-content"><p className="eyebrow">{t.inquiry.reviewKicker}</p><h3>{t.inquiry.reviewTitle}</h3><p className="review-intro">{t.inquiry.reviewDescription}</p><dl className="review-list">{rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></div>;
}

function TourDialog({ tour, copy: t, onClose }) {
  if (!tour) return null;
  const details = t.tours.tourCards[tour.id];
  return (
    <div className="tour-dialog-backdrop" role="presentation" onClick={onClose}>
      <section className="tour-dialog" role="dialog" aria-modal="true" aria-labelledby="tour-dialog-title" onClick={(event) => event.stopPropagation()}>
        <button className="dialog-close" onClick={onClose} aria-label={t.close}><Icon name="close" size={23} /></button>
        <div className="dialog-hero"><img src={imageUrl(tour.image, 1400)} alt={details.alt} /><span>{details.duration}</span></div>
        <div className="dialog-content"><p className="eyebrow">{t.tours.dialogKicker}</p><h2 id="tour-dialog-title">{details.title}</h2><p>{details.description}</p><h3>{t.tours.itineraryTitle}</h3><ol className="itinerary-list">{details.itinerary.map((day, index) => <li key={day.title}><span>DAY {String(index + 1).padStart(2, '0')}</span><div><h4>{day.title}</h4><p>{day.description}</p></div></li>)}</ol><p className="dialog-note">{t.tours.dialogNote}</p><a className="button button-dark" href="#contact" onClick={onClose}>{t.tours.requestQuote}<Icon name="arrow" size={16} /></a></div>
      </section>
    </div>
  );
}

export default App;
