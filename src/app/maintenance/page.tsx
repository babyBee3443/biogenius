
"use client";

import * as React from 'react';
import { Twitter, Facebook, Instagram, Linkedin, Youtube, Zap, Brain, Atom, Dna } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Import Button
import { Input } from '@/components/ui/input'; // Import Input
import { toast } from '@/hooks/use-toast'; // Import toast

const MaintenancePage = () => {
    const [dynamicElements, setDynamicElements] = React.useState<JSX.Element[]>([]);
    const [email, setEmail] = React.useState('');

    React.useEffect(() => {
        const elements: JSX.Element[] = [];
        const icons = [Zap, Brain, Atom, Dna];
        for (let i = 0; i < 25; i++) {
            const IconComponent = icons[i % icons.length];
            elements.push(
                <div
                    key={`particle-${i}`}
                    className="particle"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 10}s`,
                        position: 'absolute',
                        animation: `drift ${10 + Math.random() * 10}s ease-in-out infinite alternate, fadeInOut ${5 + Math.random() * 5}s ease-in-out infinite alternate`,
                        opacity: 0,
                    }}
                >
                    <IconComponent size={Math.random() * 20 + 10} strokeWidth={1 + Math.random()} className="text-cyan-400/30 dark:text-cyan-600/30" />
                </div>
            );
        }
        for (let i = 0; i < 5; i++) {
            elements.push(
                <div
                    key={`star-${i}`}
                    className="shooting-star"
                    style={{
                        position: 'absolute',
                        top: `${Math.random() * 80}%`,
                        left: '-10%',
                        width: `${Math.random() * 150 + 100}px`,
                        height: '2px',
                        background: 'linear-gradient(90deg, rgba(0, 255, 255, 0.8), transparent)',
                        borderRadius: '50%',
                        animation: `shoot ${3 + Math.random() * 4}s linear infinite ${Math.random() * 5}s`,
                        opacity: Math.random() * 0.5 + 0.3,
                        transform: `rotate(${Math.random() * -20 + 10}deg)`
                    }}
                />
            );
        }
        setDynamicElements(elements);
    }, []);

    const handleNotifySubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (email.trim() === '') {
            toast({
                variant: "destructive",
                title: "E-posta Gerekli",
                description: "Lütfen geçerli bir e-posta adresi girin.",
            });
            return;
        }
        // Basic email validation (can be improved)
        if (!/\S+@\S+\.\S+/.test(email)) {
            toast({
                variant: "destructive",
                title: "Geçersiz E-posta",
                description: "Lütfen geçerli bir e-posta adresi formatı girin.",
            });
            return;
        }

        console.log("Notify email:", email); // Placeholder for actual submission
        toast({
            title: "Haberdar Edileceksiniz!",
            description: `${email} adresine sitemiz açıldığında bilgi gönderilecektir. Teşekkürler!`,
        });
        setEmail(''); // Clear the input field
    };

    return (
        <>
            <style jsx global>{`
                @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
                @keyframes pulse { 0%, 100% { opacity: 0.6; transform: scale(1); } 50% { opacity: 1; transform: scale(1.05); } }
                @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes moveRight { from { transform: translateX(-100%); } to { transform: translateX(100%); } }
                @keyframes backgroundGradientAnimation { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
                @keyframes textGlowAnimation { 0%, 100% { text-shadow: 0 0 8px rgba(0, 255, 255, 0.6), 0 0 16px rgba(0, 255, 255, 0.4); } 50% { text-shadow: 0 0 12px rgba(0, 255, 255, 0.8), 0 0 24px rgba(0, 255, 255, 0.6); } }
                @keyframes drift { from { transform: translate(0px, 0px) rotate(0deg); } to { transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px) rotate(${Math.random() * 30 - 15}deg); } }
                @keyframes fadeInOut { 0%, 100% { opacity: 0.1; } 50% { opacity: 0.5; } }
                @keyframes shoot { 0% { transform: translateX(0) translateY(0) rotate(${Math.random() * -20 + 10}deg); opacity: 0; } 10% { opacity: ${Math.random() * 0.5 + 0.3}; } 90% { opacity: ${Math.random() * 0.5 + 0.3}; } 100% { transform: translateX(120vw) translateY(${Math.random() * 100 - 50}px) rotate(${Math.random() * -20 + 10}deg); opacity: 0; } }
                .background-gradient { background: linear-gradient(135deg, #0f2027, #203a43, #2c5364, #1a2a3a); background-size: 400% 400%; animation: backgroundGradientAnimation 25s ease infinite; }
                .glow-text { animation: textGlowAnimation 3s ease-in-out infinite; }
                .btn-glow { box-shadow: 0 0 15px rgba(0, 255, 255, 0.5); transition: all 0.3s ease; }
                .btn-glow:hover { box-shadow: 0 0 25px rgba(0, 255, 255, 0.8), 0 0 5px rgba(0, 255, 255, 1); transform: translateY(-2px) scale(1.02); }
                .social-icon { transition: all 0.3s ease; }
                .social-icon:hover { transform: translateY(-5px) scale(1.2); filter: drop-shadow(0 0 8px rgba(0, 255, 255, 0.7)); }
            `}</style>
            <div className="background-gradient text-white min-h-screen flex flex-col items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
                    {dynamicElements}
                </div>
                <div className="container mx-auto px-4 py-16 z-10 text-center">
                    <div className="mb-8">
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 glow-text">BiyoHox</h1>
                        <h2 className="text-4xl md:text-6xl font-bold mb-8 glow-text">We'll Be Back Soon</h2>
                        <h3 className="text-2xl md:text-4xl font-semibold mb-8 glow-text">Yakında Döneceğiz</h3>
                    </div>
                    <div className="max-w-2xl mx-auto mb-12">
                        <p className="text-lg md:text-xl mb-6">
                            Our website is currently undergoing scheduled maintenance to bring you an enhanced experience.
                            We appreciate your patience and look forward to serving you better.
                        </p>
                        <p className="text-lg md:text-xl">
                            Web sitemiz şu anda planlı bakım çalışmaları nedeniyle geçici olarak hizmet dışıdır.
                            Daha iyi bir deneyim sunmak için çalışıyoruz. Anlayışınız için teşekkür ederiz.
                        </p>
                    </div>
                    <div className="max-w-md mx-auto mb-16">
                        <p className="text-lg mb-4">Get notified when we're back:</p>
                        <p className="text-lg mb-4">Yeniden açıldığında haberdar olun:</p>
                        <form onSubmit={handleNotifySubmit} className="flex flex-col sm:flex-row gap-2 justify-center">
                            <Input
                                type="email"
                                placeholder="Your email / E-posta adresiniz"
                                className="px-4 py-3 rounded-lg bg-gray-800/70 backdrop-blur-sm text-white border border-cyan-400/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 w-full sm:w-64 placeholder-gray-400"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <Button type="submit" className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-semibold btn-glow">
                                Notify Me / Haber Ver
                            </Button>
                        </form>
                    </div>
                    <div className="flex justify-center gap-6 mb-8">
                        <a href="#" className="social-icon text-2xl hover:text-cyan-400" title="Twitter"><Twitter size={24} /></a>
                        <a href="#" className="social-icon text-2xl hover:text-cyan-400" title="Facebook"><Facebook size={24} /></a>
                        <a href="#" className="social-icon text-2xl hover:text-cyan-400" title="Instagram"><Instagram size={24} /></a>
                        <a href="#" className="social-icon text-2xl hover:text-cyan-400" title="LinkedIn"><Linkedin size={24} /></a>
                        <a href="#" className="social-icon text-2xl hover:text-cyan-400" title="YouTube"><Youtube size={24} /></a>
                    </div>
                    <div className="text-sm text-gray-400">
                        &copy; {new Date().getFullYear()} BiyoHox. All rights reserved.
                    </div>
                </div>
            </div>
        </>
    );
};

export default MaintenancePage;
