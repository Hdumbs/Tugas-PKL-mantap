import React, { useRef, useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Camera, Zap, RefreshCw, AlertCircle, Upload, XCircle, Grid, Sparkles, ShieldCheck, Activity } from 'lucide-react';

export default function Scanner({ errors }) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [cameraActive, setCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState(null);
    const [showGrid, setShowGrid] = useState(true);
    const [torchOn, setTorchOn] = useState(false);

    const scanErrorMessage = errors?.scan_error;

    const startCamera = async () => {
        setCameraError(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment',
                    width: { ideal: 1920 },
                    height: { ideal: 1080 }
                }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setCameraActive(true);
            }
        } catch (err) {
            console.error('Camera access failed:', err);
            setCameraError('Kamera tidak aktif atau izin ditolak. Anda tetap dapat mengunggah foto makanan.');
            setCameraActive(false);
        }
    };

    const toggleTorch = async () => {
        if (!videoRef.current || !videoRef.current.srcObject) return;
        const track = videoRef.current.srcObject.getVideoTracks()[0];
        if (track && track.getCapabilities && track.getCapabilities().torch) {
            try {
                await track.applyConstraints({
                    advanced: [{ torch: !torchOn }]
                });
                setTorchOn(!torchOn);
            } catch (e) {
                console.log('Torch error:', e);
            }
        }
    };

    useEffect(() => {
        startCamera();
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = videoRef.current.srcObject.getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, []);

    const handleCapture = () => {
        if (isProcessing) return;
        setIsProcessing(true);

        if (cameraActive && videoRef.current && canvasRef.current) {
            const canvas = canvasRef.current;
            const video = videoRef.current;
            canvas.width = video.videoWidth || 1280;
            canvas.height = video.videoHeight || 720;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

            router.post('/scan/process', { image: dataUrl }, {
                onFinish: () => setIsProcessing(false)
            });
        } else {
            router.post('/scan/process', {}, {
                onFinish: () => setIsProcessing(false)
            });
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsProcessing(true);
        const reader = new FileReader();
        reader.onloadend = () => {
            router.post('/scan/process', { image: reader.result }, {
                onFinish: () => setIsProcessing(false)
            });
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="min-h-screen bg-[#f7faf4] flex items-center justify-center p-0 md:p-6 text-[#223311] font-sans selection:bg-[#64ac1d] selection:text-white">
            <div className="w-full max-w-md md:max-w-3xl lg:max-w-5xl md:h-[88vh] bg-slate-950 flex flex-col relative md:rounded-3xl shadow-xl overflow-hidden border border-gray-200">
                
                {/* CHIAMATES Styled Header */}
                <div className="absolute top-0 left-0 right-0 z-30 flex justify-between items-center px-6 py-5 bg-gradient-to-b from-black/90 via-black/60 to-transparent backdrop-blur-md text-white">
                    <div className="flex items-center gap-3">
                        <img src="/images/logo.png" alt="Amidyas Superfood Logo" className="w-10 h-10 object-contain drop-shadow-md" />
                        <div>
                            <span className="font-extrabold text-sm md:text-base tracking-wider uppercase text-white block">Vitality AI Scanner</span>
                            <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-widest block">Amidyas Superfood</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowGrid(!showGrid)}
                            className={`p-3 rounded-2xl border transition backdrop-blur-md active:scale-95 ${
                                showGrid
                                    ? 'bg-[#64ac1d]/30 border-[#64ac1d] text-emerald-300'
                                    : 'bg-white/10 border-white/10 text-gray-400 hover:text-white'
                            }`}
                            title="Toggle Alignment Grid"
                        >
                            <Grid size={18} />
                        </button>

                        <button
                            onClick={toggleTorch}
                            className={`p-3 rounded-2xl border transition backdrop-blur-md active:scale-95 ${
                                torchOn
                                    ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                                    : 'bg-white/10 border-white/10 text-gray-400 hover:text-white'
                            }`}
                            title="Flashlight"
                        >
                            <Zap size={18} />
                        </button>
                    </div>
                </div>

                {/* Camera Screen */}
                <div className="relative flex-1 flex flex-col justify-center items-center bg-slate-950 overflow-hidden min-h-[460px]">
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${cameraActive ? 'opacity-100' : 'opacity-0'}`}
                    />
                    <canvas ref={canvasRef} className="hidden" />

                    {!cameraActive && (
                        <div
                            className="absolute inset-0 bg-cover bg-center filter brightness-40 scale-105 transition-all duration-700"
                            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80')` }}
                        />
                    )}

                    {showGrid && (
                        <div className="absolute inset-0 pointer-events-none opacity-20 grid grid-cols-3 grid-rows-3 z-10">
                            <div className="border-r border-b border-[#64ac1d]" />
                            <div className="border-r border-b border-[#64ac1d]" />
                            <div className="border-b border-[#64ac1d]" />
                            <div className="border-r border-b border-[#64ac1d]" />
                            <div className="border-r border-b border-[#64ac1d]" />
                            <div className="border-b border-[#64ac1d]" />
                            <div className="border-r border-[#64ac1d]" />
                            <div className="border-r border-[#64ac1d]" />
                            <div />
                        </div>
                    )}

                    {scanErrorMessage && (
                        <div className="absolute top-24 z-40 mx-6 bg-rose-600/95 text-white text-xs md:text-sm font-black px-6 py-3.5 rounded-2xl shadow-2xl backdrop-blur-md border border-rose-400 flex items-center gap-3 animate-bounce">
                            <XCircle size={22} className="shrink-0 text-white" />
                            <span>{scanErrorMessage}</span>
                        </div>
                    )}

                    {/* Target Reticle */}
                    <div className="relative z-20 w-72 md:w-96 h-72 md:h-96 border-2 border-[#64ac1d] rounded-3xl flex items-center justify-center p-4 shadow-[0_0_50px_rgba(100,172,29,0.3)]">
                        <div className="absolute -top-1 -left-1 w-10 h-10 border-t-4 border-l-4 border-[#64ac1d] rounded-tl-2xl" />
                        <div className="absolute -top-1 -right-1 w-10 h-10 border-t-4 border-r-4 border-[#64ac1d] rounded-tr-2xl" />
                        <div className="absolute -bottom-1 -left-1 w-10 h-10 border-b-4 border-l-4 border-[#64ac1d] rounded-bl-2xl" />
                        <div className="absolute -bottom-1 -right-1 w-10 h-10 border-b-4 border-r-4 border-[#64ac1d] rounded-br-2xl" />

                        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#64ac1d] to-transparent shadow-[0_0_20px_#64ac1d] animate-bounce" />

                        <div className="bg-black/70 backdrop-blur-md px-5 py-2.5 rounded-full text-xs font-extrabold text-emerald-300 border border-[#64ac1d]/50 shadow-xl flex items-center gap-2">
                            <Sparkles size={16} className="animate-spin text-emerald-400" />
                            Posisikan hidangan di dalam bingkai
                        </div>
                    </div>

                    {cameraError && (
                        <div className="relative z-20 mx-6 mt-4 bg-amber-500/20 border border-amber-500/40 text-amber-200 text-xs px-4 py-2.5 rounded-xl backdrop-blur-md flex items-center gap-2">
                            <AlertCircle size={16} className="shrink-0 text-amber-400" />
                            <span>{cameraError}</span>
                        </div>
                    )}
                </div>

                {/* Shutter Dock Area */}
                <div className="relative z-30 bg-slate-950 p-6 md:p-8 flex items-center justify-center gap-8 border-t border-slate-800">
                    <label
                        className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-gray-300 hover:text-emerald-400 hover:border-[#64ac1d] transition cursor-pointer active:scale-95 shadow-md flex flex-col items-center gap-1"
                        title="Upload Foto Makanan Dari Galeri"
                    >
                        <Upload size={22} />
                        <span className="text-[9px] font-extrabold uppercase tracking-wider text-gray-400">Galeri</span>
                        <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>

                    <div className="relative p-1.5 bg-[#64ac1d] rounded-full shadow-[0_0_35px_rgba(100,172,29,0.5)]">
                        <button
                            onClick={handleCapture}
                            disabled={isProcessing}
                            className="relative w-20 h-20 md:w-22 md:h-22 rounded-full bg-[#64ac1d] hover:bg-emerald-600 flex items-center justify-center border-4 border-slate-950 active:scale-95 transition-all shadow-inner"
                        >
                            {isProcessing ? (
                                <RefreshCw className="animate-spin text-white" size={36} />
                            ) : (
                                <Camera className="text-white" size={40} />
                            )}
                        </button>
                    </div>

                    <button
                        onClick={startCamera}
                        className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-gray-300 hover:text-emerald-400 hover:border-[#64ac1d] transition active:scale-95 shadow-md flex flex-col items-center gap-1"
                        title="Muat Ulang Kamera"
                    >
                        <RefreshCw size={22} />
                        <span className="text-[9px] font-extrabold uppercase tracking-wider text-gray-400">Reload</span>
                    </button>
                </div>

                {isProcessing && (
                    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex flex-col items-center justify-center space-y-4 text-white">
                        <div className="w-20 h-20 rounded-full border-4 border-[#64ac1d]/30 border-t-[#64ac1d] animate-spin flex items-center justify-center shadow-[0_0_40px_#64ac1d]">
                            <Sparkles size={30} className="text-[#64ac1d] animate-pulse" />
                        </div>
                        <h3 className="text-xl font-black tracking-wide">Menganalisis Makanan...</h3>
                        <p className="text-xs text-gray-400 font-bold">Gemini AI sedang menghitung kalori & makronutrisi hidangan kamu</p>
                    </div>
                )}

            </div>
        </div>
    );
}
