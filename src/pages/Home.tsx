import { Layout } from '@/components/Layout/Layout';
import { Hero } from '@/components/Home/Hero';
import { NavigationCards } from '@/components/Home/NavigationCards';

export const Home = () => {
  return (
    <Layout currentPage="home">
      <Hero />
      <NavigationCards />
    </Layout>
  );
};