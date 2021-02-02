import './App.css';
import Upload from './components/Upload';
import Header from './components/Header'
import ImageComponent from './components/ImageComponent'

function Home() {
  return (
    <>
    <header>
      <Header className="header" title="Facial Recognition + Bias Visualization"></Header>
    </header>
    <h2 className="page-title">Background</h2>
    <div className="main-container">
      <div className="text-container">
        <div className="info-widget box">
          </div>
          <div className="stats-container">
            <div className="stats-widget1 box">

            </div>
            <div className="stats-widget2 box">
              </div>
          </div>
      </div>
      <div className="image-upload-widget box">
          <ImageComponent className="image-upload"></ImageComponent>
      </div>
    </div>
    <footer>
      
    </footer>
    </>
  );
}

export default Home;
