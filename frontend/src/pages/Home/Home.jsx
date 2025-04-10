import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Home.module.css';
import { Shield, Zap, Smartphone, Diamond, ArrowRight, Home as HomeIcon,FileText, DollarSign } from 'lucide-react';

const Home = ({ account, loading, connectWallet }) => {
  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            Real Estate <span className={styles.highlight}>Reimagined</span> with Blockchain
          </h1>
          <p className={styles.description}>
            Buy, sell, and manage properties with unprecedented security, transparency, 
            and efficiency through our blockchain-powered real estate platform.
          </p>
          
          {!account ? (
            <button
              className={styles.connectButton}
              onClick={connectWallet}
              disabled={loading}
            >
              {loading ? 'Connecting...' : 'Connect Wallet to Get Started'}
              {!loading && <ArrowRight className={styles.buttonIcon} size={20} />}
            </button>
          ) : (
            <div className={styles.actions}>
              <Link to="/buy" className={`${styles.actionButton} ${styles.primaryAction}`}>
                <HomeIcon size={20} className={styles.buttonIcon} />
                Browse Properties
              </Link>
              <Link to="/sell" className={styles.actionButton}>
                <DollarSign size={20} className={styles.buttonIcon} />
                List a Property
              </Link>
              <Link to="/profile" className={styles.actionButton}>
                <FileText size={20} className={styles.buttonIcon} />
                My Properties
              </Link>
            </div>
          )}
          
          <div className={styles.trustBadges}>
            <div className={styles.badge}>
              <span className={styles.badgeNumber}>1000+</span>
              <span className={styles.badgeText}>Properties Listed</span>
            </div>
            <div className={styles.badge}>
              <span className={styles.badgeNumber}>500+</span>
              <span className={styles.badgeText}>Successful Transactions</span>
            </div>
            <div className={styles.badge}>
              <span className={styles.badgeNumber}>98%</span>
              <span className={styles.badgeText}>Customer Satisfaction</span>
            </div>
          </div>
        </div>
        
        <div className={styles.heroImages}>
        <img 
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80" 
            alt="Luxury Home" 
            className={styles.mainImage}
          />
          <div className={styles.imageGrid}>
            <img 
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=875&q=80" 
              alt="Modern House" 
              className={styles.gridImage}
            />
            <img 
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=853&q=80" 
              alt="Contemporary Home" 
              className={styles.gridImage}
            />
            <img 
              src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80" 
              alt="Luxury Villa" 
              className={styles.gridImage}
            />
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className={styles.howItWorks}>
        <h2 className={styles.sectionTitle}>How It Works</h2>
        <div className={styles.stepsContainer}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3>Connect Your Digital Wallet</h3>
            <p>Securely connect your blockchain wallet to access our platform's features</p>
          </div>
          <div className={styles.stepDivider}></div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3>Browse or List Properties</h3>
            <p>Explore available listings or create your own property listing in minutes</p>
          </div>
          <div className={styles.stepDivider}></div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3>Smart Contract Transaction</h3>
            <p>Complete your transaction securely with our automated smart contracts</p>
          </div>
          <div className={styles.stepDivider}></div>
          <div className={styles.step}>
            <div className={styles.stepNumber}>4</div>
            <h3>Claim Ownership</h3>
            <p>Receive your digital property deed with verified blockchain ownership</p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className={styles.features}>
        <h2 className={styles.sectionTitle}>The Future of Real Estate</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIconContainer}>
              <Shield className={styles.featureIcon} />
            </div>
            <h3>Secure Transactions</h3>
            <p>Every property transaction is secured by immutable blockchain technology, eliminating fraud and forgery</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIconContainer}>
              <Zap className={styles.featureIcon} />
            </div>
            <h3>Fast Processing</h3>
            <p>Skip the traditional paperwork and waiting periods with quick, automated smart contract execution</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIconContainer}>
              <Smartphone className={styles.featureIcon} />
            </div>
            <h3>Easy to Use</h3>
            <p>Our intuitive interface makes blockchain property transactions accessible to everyone</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIconContainer}>
              <Diamond className={styles.featureIcon} />
            </div>
            <h3>Full Transparency</h3>
            <p>Complete visibility of property history, ownership details, and transaction records</p>
          </div>
        </div>
      </div>

      {/* Blockchain Advantage Section */}
      <div className={styles.blockchainSection}>
        <div className={styles.blockchainContent}>
          <h2 className={styles.sectionTitle}>The Blockchain Advantage</h2>
          <p className={styles.blockchainDescription}>
            Our platform leverages cutting-edge blockchain technology to revolutionize the real estate industry.
            Smart contracts automate and secure every step of the property transaction process.
          </p>
          <div className={styles.blockchainFeatures}>
            <div className={styles.blockchainFeature}>
              <div className={styles.featureCheck}>✓</div>
              <p>Eliminate intermediaries and reduce fees</p>
            </div>
            <div className={styles.blockchainFeature}>
              <div className={styles.featureCheck}>✓</div>
              <p>Immutable property records prevent fraud</p>
            </div>
            <div className={styles.blockchainFeature}>
              <div className={styles.featureCheck}>✓</div>
              <p>Transparent pricing and ownership history</p>
            </div>
            <div className={styles.blockchainFeature}>
              <div className={styles.featureCheck}>✓</div>
              <p>Automated escrow and instant settlements</p>
            </div>
            <div className={styles.blockchainFeature}>
              <div className={styles.featureCheck}>✓</div>
              <p>Fractional ownership opportunities</p>
            </div>
            <div className={styles.blockchainFeature}>
              <div className={styles.featureCheck}>✓</div>
              <p>Global access to property investments</p>
            </div>
          </div>
        </div>
        <div className={styles.blockchainGraphic}>
          <div className={styles.blockchainAnimation}></div>
        </div>
      </div>

      {/* Testimonials */}
      <div className={styles.testimonials}>
        <h2 className={styles.sectionTitle}>What Our Users Say</h2>
        <div className={styles.testimonialsGrid}>
          <div className={styles.testimonialCard}>
            <div className={styles.testimonialQuote}>"</div>
            <p className={styles.testimonialText}>I was able to sell my property in just 3 days with complete security and zero paperwork. The future is here!</p>
            <div className={styles.testimonialAuthor}>
              <div className={styles.testimonialAvatar}></div>
              <div>
                <p className={styles.testimonialName}>Sarah Johnson</p>
                <p className={styles.testimonialRole}>Property Seller</p>
              </div>
            </div>
          </div>
          <div className={styles.testimonialCard}>
            <div className={styles.testimonialQuote}>"</div>
            <p className={styles.testimonialText}>As a first-time buyer, the transparency of blockchain gave me confidence in my purchase. I could see the entire history of the property.</p>
            <div className={styles.testimonialAuthor}>
              <div className={styles.testimonialAvatar}></div>
              <div>
                <p className={styles.testimonialName}>David Chen</p>
                <p className={styles.testimonialRole}>Property Buyer</p>
              </div>
            </div>
          </div>
          <div className={styles.testimonialCard}>
            <div className={styles.testimonialQuote}>"</div>
            <p className={styles.testimonialText}>The smart contracts executed exactly as promised. No surprises, no delays, just a seamless transaction from start to finish.</p>
            <div className={styles.testimonialAuthor}>
              <div className={styles.testimonialAvatar}></div>
              <div>
                <p className={styles.testimonialName}>Michael Rodriguez</p>
                <p className={styles.testimonialRole}>Real Estate Investor</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Ready to Transform Your Real Estate Experience?</h2>
        <p className={styles.ctaDescription}>Join thousands of users who are already benefiting from blockchain-powered property transactions</p>
        <button 
          className={styles.ctaButton}
          onClick={connectWallet}
          disabled={loading || account}
        >
          {account ? 'You\'re Connected!' : loading ? 'Connecting...' : 'Connect Your Wallet Now'}
          {!loading && !account && <ArrowRight className={styles.buttonIcon} size={20} />}
        </button>
      </div>
    </div>
  );
};

export default Home;