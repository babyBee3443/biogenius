"use client";

import * as React from 'react';
import { Twitter, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';

const MaintenancePage = () => {
    const [dynamicElements, setDynamicElements] = React.useState<JSX.Element[]>([]);

    React.useEffect(() => {
        const elements: JSX.Element[] = [];
        // Create helix elements
        for (let i = 0; i < 12; i++) {
            elements.push(
                <div
                    key={`helix-${i}`}
                    className="helix"
                    style={{
                        left: `${Math.random() * 90 + 5}%`,
                        top: `${Math.random() * 90 + 5}%`,
                        animationDelay: `${Math.random() * 5}s`,
                        position: 'absolute',
                        width: '4px',
                        height: '200px',
                        background: 'linear-gradient(to bottom, rgba(0, 255, 255, 0.5), rgba(0, 255, 255, 0))',
                        animation: 'float 8s ease-in-out infinite',
                    }}
                />
            );
        }
        // Create node elements
        for (let i = 0; i < 20; i++) {
            elements.push(
                <div
                    key={`node-${i}`}
                    className="node"
                    style={{
                        left: `${Math.random() * 90 + 5}%`,
                        top: `${Math.random() * 90 + 5}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        position: 'absolute',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(0, 255, 127, 0.7)',
                        animation: 'pulse 2s ease-in-out infinite',
                    }}
                />
            );
        }
        // Create molecule elements
        for (let i = 0; i < 3; i++) {
            elements.push(
                <div
                    key={`molecule-${i}`}
                    className="molecule"
                    style={{
                        left: `${Math.random() * 80 + 10}%`,
                        top: `${Math.random() * 80 + 10}%`,
                        animationDelay: `${Math.random() * 10}s`,
                        position: 'absolute',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(138, 43, 226, 0.5)',
                        animation: 'rotate 20s linear infinite',
                    }}
                >
                    <div style={{
                        content: "''",
                        position: 'absolute',
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(75, 0, 130, 0.4)',
                        top: '-15px',
                        left: '-15px'
                    }}></div>
                    <div style={{
                        content: "''",
                        position: 'absolute',
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(75, 0, 130, 0.4)',
                        bottom: '-15px',
                        right: '-15px'
                    }}></div>
                </div>
            );
        }
        setDynamicElements(elements);
    }, []);

    return (
        <>
            <style jsx global>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes pulse {
                    0%, 100% { opacity: 0.8; }
                    50% { opacity: 1; }
                }
                @keyframes rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes moveRight {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(100%); }
                }
                .background-gradient {
                    background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
                }
                .glow-text {
                    text-shadow: 0 0 10px rgba(0, 255, 255, 0.7), 0 0 20px rgba(0, 255, 255, 0.5);
                }
                .btn-glow {
                    box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
                    transition: all 0.3s ease;
                }
                .btn-glow:hover {
                    box-shadow: 0 0 25px rgba(0, 255, 255, 0.8);
                    transform: translateY(-2px);
                }
                .social-icon {
                    transition: all 0.3s ease;
                }
                .social-icon:hover {
                    transform: translateY(-5px) scale(1.2);
                    filter: drop-shadow(0 0 8px rgba(0, 255, 255, 0.7));
                }
            `}</style>
            <div className="background-gradient text-white min-h-screen flex flex-col items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 w-full h-full overflow-hidden z-[-1]">
                    {dynamicElements}
                    <div style={{ position: 'absolute', top: '40%', width: '100%', height: '2px', background: 'linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.3), transparent)', animation: 'moveRight 30s linear infinite' }}></div>
                </div>

                <div className="container mx-auto px-4 py-16 z-10 text-center">
                    <div className="mb-8">
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 glow-text">TeknoBiyo</h1>
                        <h2 className="text-4xl md:text-6xl font-bold mb-8 glow-text">We'll Be Back Soon</h2>
                        <h3 className="text-2xl md:text-4xl font-semibold mb-8 glow-text">Yakında Döneceğiz</h3>
                    </div>

                    <div className="max-w-2xl mx-auto mb-12">
                        <p className="text-lg md:text-xl mb-6">
                            Our website is currently undergoing scheduled maintenance to bring you an enhanced experience.
                            We appreciate your patience and look forward to serving you better.
                        </p>
                        <p className="text-lg md:text-xl">
                            Web sitemiz şu anda planlı bakım çalışmaları nedeniyle geçici olarak hizmet dışındadır.
                            Daha iyi bir deneyim sunmak için çalışıyoruz. Anlayışınız için teşekkür ederiz.
                        </p>
                    </div>

                    <div className="max-w-md mx-auto mb-16">
                        <p className="text-lg mb-4">Get notified when we're back:</p>
                        <p className="text-lg mb-4">Yeniden açıldığında haberdar olun:</p>
                        <form className="flex flex-col sm:flex-row gap-2 justify-center">
                            <input type="email" placeholder="Your email / E-posta adresiniz" className="px-4 py-3 rounded-lg bg-gray-800 text-white border border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 w-full sm:w-64" />
                            <button type="submit" className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-semibold btn-glow">
                                Notify Me / Haber Ver
                            </button>
                        </form>
                    </div>

                    <div className="flex justify-center gap-6 mb-8">
                        <a href="#" className="social-icon text-2xl hover:text-cyan-400" title="Twitter">
                            <Twitter size={24} />
                        </a>
                        <a href="#" className="social-icon text-2xl hover:text-cyan-400" title="Facebook">
                            <Facebook size={24} />
                        </a>
                        <a href="#" className="social-icon text-2xl hover:text-cyan-400" title="Instagram">
                            <Instagram size={24} />
                        </a>
                        <a href="#" className="social-icon text-2xl hover:text-cyan-400" title="LinkedIn">
                            <Linkedin size={24} />
                        </a>
                        <a href="#" className="social-icon text-2xl hover:text-cyan-400" title="YouTube">
                            <Youtube size={24} />
                        </a>
                    </div>

                    <div className="text-sm text-gray-400">
                        &copy; {new Date().getFullYear()} TeknoBiyo. All rights reserved.
                    </div>
                </div>
            </div>
        </>
    );
};

export default MaintenancePage;