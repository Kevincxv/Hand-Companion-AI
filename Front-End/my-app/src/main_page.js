import './main_page.css';
import React from 'react';
import { FaMoon, FaSun, FaCog, FaWrench, FaLayerGroup, FaMagic } from 'react-icons/fa';
import { BrowserRouter as Router, Link } from 'react-router-dom';

function App() {
    return (
        <Router>
            <div className="min-height">
                <header className="p-4 bg-blue-500 shadow-md">
                    <div className="container mx-auto flex justify-between items-center">
                        {/*<img src="/path-to-your-logo.png" alt="Logo" className="h-8" />*/}
                        <nav>
                            <ul className="flex space-x-4">
                                <li><Link to="/" className="text-white hover:underline">Home</Link></li>
                                <li><Link to="/about" className="text-white hover:underline">About Us</Link></li>
                                <li><Link to="/services" className="text-white hover:underline">Services</Link></li>
                                <li><Link to="/team" className="text-white hover:underline">Team</Link></li>
                            </ul>
                        </nav>
                        <div className="flex space-x-4 items-center">
                            <FaSun className="text-yellow-500 h-6 w-6" />
                            <FaMoon className="text-white h-6 w-6" />
                            <FaCog className="text-white h-6 w-6" />
                        </div>
                    </div>
                </header>
                <main className="bg-blue-500 container mx-auto flex justify-center items-center h-[75vh] relative">  {/* Adjusted height here */}
                    <div className="absolute bottom-0 left-0 w-full overflow-hidden" style={{ height: '100px' }}>

                    </div>
                    <button className="bg-white text-blue-500 p-4 rounded-full shadow-lg hover:bg-blue-600 hover:text-white">
                        Translate Now
                    </button>
                    {/*<img src="none" alt="Rotating Hands" className="animate-spin h-24 w-24" />*/}
                </main>
                <section id="about-section" className="container mx-auto py-56 bg-white">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold mb-2 text-blue-500">What is Sofbox?</h2>
                        <div className="bg-blue-600 w-20 mx-auto mb-4" style={{ height: '3px' }}></div>
                        <p className="mb-8 text-blue-500">Sofbox is a sleek, clean, and powerful landing page template.</p>
                    </div>
                    <div className="grid grid-cols-3 gap-8 mb-2 text-blue-500">
                        {[
                            { icon: FaWrench, title: 'Easy to Customize', description: 'Sofbox is designed to be easily customizable.' },
                            { icon: FaLayerGroup, title: 'Multilayer Purpose Layout', description: 'It offers multiple layouts for various purposes.' },
                            { icon: FaMagic, title: 'Unique Design', description: 'The design of Sofbox is unique and modern.' }
                        ].map((box, index) => (
                            <div key={index} className="box bg-white p-8 rounded shadow hover:shadow-lg transition-shadow duration-300">
                                <div className="circle-icon bg-blue-500 p-4 rounded-full mb-4">
                                    <box.icon className="text-white h-6 w-6" />
                                </div>
                                <h3 className="text-xl mb-2 text-blue-500">{box.title}</h3>
                                <p className="text-blue-500">{box.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </Router>
    );
}

export default App;