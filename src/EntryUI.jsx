import { useState, useEffect, useRef } from 'react';

export default function EntryUI({ onSubmit, isListening, setIsListening }) {
    const [prompt, setPrompt] = useState("");
    const [liveTranscript, setLiveTranscript] = useState("");

    const audioContextRef = useRef(null);
    const streamRef = useRef(null);
    const animationFrameRef = useRef(null);
    const dotRefs = useRef([]);
    const recognitionRef = useRef(null);

    useEffect(() => {
        if (isListening) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = true;

                recognition.onresult = (event) => {
                    let currentTranscript = "";
                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        currentTranscript += event.results[i][0].transcript;
                    }
                    setLiveTranscript(currentTranscript);
                };

                recognition.start();
                recognitionRef.current = recognition;
            } else {
                console.warn("Speech recognition not supported in this browser.");
            }

            navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
                streamRef.current = stream;
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                const audioCtx = new AudioContext();
                const analyzer = audioCtx.createAnalyser();
                analyzer.fftSize = 256;
                const source = audioCtx.createMediaStreamSource(stream);
                source.connect(analyzer);
                audioContextRef.current = audioCtx;

                const dataArray = new Uint8Array(analyzer.frequencyBinCount);
                const voiceBins = [2, 5, 10, 18];

                const renderFrame = () => {
                    analyzer.getByteFrequencyData(dataArray);
                    for (let i = 0; i < 4; i++) {
                        if (dotRefs.current[i]) {
                            const rawVolume = dataArray[voiceBins[i]];
                            const normalized = rawVolume / 255;
                            const scaleY = 1 + Math.pow(normalized, 2.5) * 8;
                            dotRefs.current[i].style.transform = `scaleY(${scaleY})`;
                        }
                    }
                    animationFrameRef.current = requestAnimationFrame(renderFrame);
                };
                renderFrame();
            }).catch(err => console.error("Mic access denied:", err));

        } else {
            if (recognitionRef.current) recognitionRef.current.stop();
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
            if (audioContextRef.current) audioContextRef.current.close();

            dotRefs.current.forEach(dot => {
                if (dot) dot.style.transform = 'scaleY(1)';
            });
            setLiveTranscript("");
        }

        return () => {
            if (recognitionRef.current) recognitionRef.current.stop();
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
        };
    }, [isListening]);

    const handleFinishRecording = () => {
        setIsListening(false);
        const finalPrompt = liveTranscript || prompt;
        if (finalPrompt.trim() !== "") {
            onSubmit(finalPrompt);
        }
    };

    return (
        <div style={{
            position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh',
            zIndex: 10, pointerEvents: 'none', fontFamily: '"Space Grotesk", sans-serif'
        }}>

            {/* Invisible Overlay to capture taps when listening */}
            {isListening && (
                <div
                    style={{ position: 'absolute', inset: 0, pointerEvents: 'auto', cursor: 'pointer', zIndex: 5 }}
                    onClick={handleFinishRecording}
                />
            )}

            {/* Top Header with Brand */}
            <div style={{
                position: 'absolute', top: '24px', left: '32px', right: '32px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                opacity: isListening ? 0.3 : 1, transition: 'opacity 0.4s ease',
                pointerEvents: 'auto'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                            <circle cx="12" cy="12" r="3" />
                            <line x1="12" y1="3" x2="12" y2="9" />
                            <line x1="12" y1="15" x2="12" y2="21" />
                            <line x1="3" y1="12" x2="9" y2="12" />
                            <line x1="15" y1="12" x2="21" y2="12" />
                            <line x1="5.6" y1="5.6" x2="9.2" y2="9.2" />
                            <line x1="14.8" y1="14.8" x2="18.4" y2="18.4" />
                        </svg>
                    </div>
                    <span style={{ 
                        color: '#e8e6f0', 
                        fontSize: '14px', 
                        fontWeight: '500', 
                        letterSpacing: '1px',
                        textTransform: 'uppercase'
                    }}>
                        Gedanken Engine
                    </span>
                </div>
                <div style={{ 
                    display: 'flex', 
                    gap: '8px', 
                    alignItems: 'center',
                    padding: '8px 16px',
                    background: 'rgba(124, 58, 237, 0.15)',
                    borderRadius: '20px',
                    border: '1px solid rgba(124, 58, 237, 0.3)'
                }}>
                    <div style={{ 
                        width: '6px', height: '6px', borderRadius: '50%', 
                        background: '#00d4ff',
                        boxShadow: '0 0 8px #00d4ff'
                    }} />
                    <span style={{ color: '#a8a4b8', fontSize: '11px', letterSpacing: '1px' }}>
                        CREATIVE STUDIO
                    </span>
                </div>
            </div>

            {/* Main Title Section */}
            <div style={{
                position: 'absolute', top: '18vh', width: '100%', textAlign: 'center',
                opacity: isListening ? 0 : 1, transition: 'opacity 0.4s ease',
            }}>
                <p style={{
                    color: '#00d4ff', fontSize: '12px', fontWeight: '500', 
                    letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 16px 0'
                }}>
                    Generative Campaign Studio
                </p>
                <h1 style={{
                    color: '#e8e6f0', fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: '300', 
                    margin: 0, letterSpacing: '-1px', lineHeight: 1.2
                }}>
                    What story are we telling?
                </h1>
                <p style={{
                    color: '#6b6880', fontSize: '14px', maxWidth: '500px', margin: '20px auto 0',
                    lineHeight: 1.6
                }}>
                    Describe your product or idea and watch as AI orchestrates 
                    branching creative directions with generated visuals, scripts, and assets.
                </p>
            </div>

            {/* Live Transcription Text */}
            <div style={{
                position: 'absolute', top: '35vh', width: '100%', textAlign: 'center', padding: '0 20px',
                color: '#e8e6f0', fontSize: '28px', fontWeight: '300',
                opacity: isListening ? 1 : 0, transition: 'opacity 0.4s ease',
                textShadow: '0 0 30px rgba(0, 212, 255, 0.5)', zIndex: 10
            }}>
                {liveTranscript || (isListening ? "Listening..." : "")}
            </div>

            {/* The Waveform */}
            <div style={{
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                display: isListening ? 'flex' : 'none', gap: '24px', alignItems: 'center', height: '80px', zIndex: 10
            }}>
                {[0, 1, 2, 3].map((i) => (
                    <div key={i} ref={el => dotRefs.current[i] = el}
                         style={{
                             width: '20px', height: '20px', 
                             background: 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)',
                             borderRadius: '50px',
                             boxShadow: '0 0 20px rgba(0, 212, 255, 0.6), 0 0 40px rgba(124, 58, 237, 0.4)', 
                             transition: 'transform 0.08s cubic-bezier(0.2, 0.8, 0.2, 1)'
                         }}
                    />
                ))}
            </div>

            {/* Helper Text */}
            <div style={{
                position: 'absolute', bottom: '25vh', width: '100%', textAlign: 'center',
                color: '#6b6880', fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase',
                opacity: isListening ? 1 : 0, transition: 'opacity 0.5s ease',
                animation: isListening ? 'pulse 2s infinite' : 'none'
            }}>
                Tap anywhere to generate
            </div>

            {/* Quick Topic Pills */}
            <div style={{
                position: 'absolute', bottom: '20vh', left: '50%', transform: 'translateX(-50%)',
                display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center',
                maxWidth: '700px', padding: '0 20px',
                opacity: isListening ? 0 : 1, transition: 'opacity 0.4s ease',
                pointerEvents: isListening ? 'none' : 'auto'
            }}>
                {['Ocean Plastic Sneakers', 'AI Wellness App', 'Sustainable Coffee Brand', 'Electric Bike Launch'].map((topic) => (
                    <button
                        key={topic}
                        onClick={() => onSubmit(topic)}
                        style={{
                            background: 'rgba(124, 58, 237, 0.1)',
                            border: '1px solid rgba(124, 58, 237, 0.3)',
                            borderRadius: '20px',
                            padding: '8px 16px',
                            color: '#a8a4b8',
                            fontSize: '12px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            fontFamily: '"Space Grotesk", sans-serif'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = 'rgba(124, 58, 237, 0.25)';
                            e.target.style.borderColor = '#7c3aed';
                            e.target.style.color = '#e8e6f0';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'rgba(124, 58, 237, 0.1)';
                            e.target.style.borderColor = 'rgba(124, 58, 237, 0.3)';
                            e.target.style.color = '#a8a4b8';
                        }}
                    >
                        {topic}
                    </button>
                ))}
            </div>

            {/* Input Pill */}
            <div style={{
                position: 'absolute', bottom: '8vh', left: '50%', transform: 'translateX(-50%)',
                pointerEvents: isListening ? 'none' : 'auto', opacity: isListening ? 0 : 1, transition: 'opacity 0.4s ease',
                display: 'flex', alignItems: 'center', gap: '12px', 
                background: 'rgba(15, 7, 40, 0.8)',
                backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', 
                border: '1px solid rgba(124, 58, 237, 0.3)',
                borderRadius: '50px', padding: '14px 24px', width: 'min(90%, 480px)', zIndex: 10,
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
            }}>
                <svg
                    onClick={() => setIsListening(true)}
                    width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    style={{ cursor: 'pointer', flexShrink: 0, transition: 'all 0.3s ease' }}
                    onMouseEnter={(e) => e.target.style.stroke = '#7c3aed'}
                    onMouseLeave={(e) => e.target.style.stroke = '#00d4ff'}
                >
                    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path>
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                    <line x1="12" y1="19" x2="12" y2="23"></line>
                    <line x1="8" y1="23" x2="16" y2="23"></line>
                </svg>
                <input
                    type="text" placeholder="Describe your product or campaign idea..."
                    value={prompt} onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && prompt.trim() !== "") onSubmit(prompt); }}
                    style={{ 
                        background: 'transparent', border: 'none', color: '#e8e6f0', 
                        fontSize: '15px', width: '100%', outline: 'none', 
                        fontFamily: '"Space Grotesk", sans-serif',
                        letterSpacing: '0.3px'
                    }}
                />
                <button
                    onClick={() => { if (prompt.trim() !== "") onSubmit(prompt); }}
                    disabled={prompt.trim() === ""}
                    style={{
                        background: prompt.trim() !== "" ? 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)' : 'rgba(107, 104, 128, 0.3)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '36px', height: '36px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: prompt.trim() !== "" ? 'pointer' : 'default',
                        transition: 'all 0.3s ease',
                        flexShrink: 0
                    }}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </button>
            </div>

        </div>
    );
}
