import React, { useEffect, useState } from "react";
// import AntioquiaMap from "./AntioquiaMap";
import "./LandingPage.css";
import orchidsImage from "../assets/orchids_image.jpg";
import VirusMap from "./VirusMap";
// import LegendSection from "./LegendSection";

export default function LandingPage() {
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowContent(true), 400);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="landing-container">
            {/* Fullscreen background image */}
            <div className="header-with-image">
                <img className="image-background" src={orchidsImage} alt="Background" />
                <div className="header-content-outer">
                  <div className={`slide-in-rectangle${showContent ? " show" : ""}`}>
                    <div className="header-text">
                        <h1 className={`fade-in${showContent ? " show" : ""}`}>Article Title</h1>
                        <p className={`authors fade-in${showContent ? " show" : ""}`}>Author1 – Author2 – Author3 – Author4 – Author5</p>
                        <div className={`abstract-box fade-in${showContent ? " show" : ""}`}>
                            <h3>Abstract</h3>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut non
                                vehicula nisi. Nulla venenatis augue cursus, egestas nulla id,
                                vehicula nisi. Nulla venenatis augue cursus, egestas nulla id,
                                hendrerit dui. Aenean in rutrum odio. Nunc vulputate accumsan
                                metus ac egestas. Curabitur euismod justo ut eros feugiat
                                ultricies in vitae tortor. Aenean nec ex hendrerit, posuere tortor
                                ut, molestie ante. Suspendisse blandit fringilla hendrerit. Nullam
                                diam ex, convallis ut placerat at, egestas quis purus. Phasellus
                                interdum dignissim ligula, ut tempor arcu viverra sit amet.
                                Aliquam posuere justo id volutpat ullamcorper. Integer tincidunt
                                lobortis eros, sed accumsan risus congue et.
                            </p>                                
                        </div>
                    </div>
                  </div>
                </div>
            </div>
            {/* Mapa mundial e info virus */}
            <div style={{marginTop: 60, marginBottom: 60}}>
              <VirusMap />
            </div>
        </div>
    );
}