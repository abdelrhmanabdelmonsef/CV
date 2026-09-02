import cvData from 'cv-data';
import ControlPanel from '../components/ui/ControlPanel';
import CvSections from '../components/cv/CvSections';
import Footer from '../components/layout/Footer';
import Header from '../components/layout/Header';
import MatrixCanvas from '../components/ui/MatrixCanvas';
import SecurityTerminal from '../components/cv/SecurityTerminal';

export default function Home() {
  return (
    <>
      <MatrixCanvas />
      <ControlPanel />
      <main id="main-content" className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-12">
        <Header personal={cvData.personal} />
        <SecurityTerminal terminal={cvData.terminal} />
        <CvSections data={cvData} />
        <Footer footer={cvData.footer} />
      </main>
    </>
  );
}
