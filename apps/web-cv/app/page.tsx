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
      <div className="wrapper">
        <Header personal={cvData.personal} />
        <SecurityTerminal terminal={cvData.terminal} />
        <CvSections data={cvData} />
        <Footer footer={cvData.footer} />
      </div>
    </>
  );
}
