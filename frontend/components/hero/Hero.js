import { getHeroes } from '@/utils/hero';
import HeroSlider from './HeroSlider';

const Hero = async () => {
  try {
    // Fetch the hero images
    const heroImages = await getHeroes();
    console.log(heroImages);

    // Make sure the payload and heroes exist before passing them to the HeroSlider
    const images = heroImages?.payload?.heroes || [];

    // Return the HeroSlider with images as prop
    return <HeroSlider heroes={images} />;
  } catch (error) {
    console.error('Error fetching hero images:', error);
    return <div>Failed to load hero images.</div>;
  }
};

export default Hero;
