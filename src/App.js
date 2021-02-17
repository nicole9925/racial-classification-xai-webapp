import './App.css';
import Header from './components/Header'
import ImageComponent from './components/ImageComponent'
import Info from './components/Info'
import React, {useState} from 'react'
import background from './text_data/background'

function Home() {
  const [progress, setProgress] = useState('getUpload');
  const [data, setData] = useState(background)
  const [title, setTitle] = useState("Background")
  // console.log(setProgress)
  return (
    <>
    <header>
      <Header className="header" title="Facial Recognition + Bias Visualization"></Header>
    </header>
    <h2 className="page-title">{title}</h2>
    <div className="main-container">
      <div className="text-container">
        <div className="info-widget box">
        <Info data={data} progress={progress} setTitle={setTitle}></Info>
          </div>
          <div className="stats-container">
            <div className="stats-widget1 box">
            </div>
            <div className="stats-widget2 box">
              </div>
          </div>
      </div>
      <div className="image-upload-widget box">
          <ImageComponent className="image-upload" setData={setData} setProgress={setProgress} progress={progress} data={data}></ImageComponent>
      </div>
    </div>
    <footer>
      
    </footer>
    </>
  );
}

export default Home;
