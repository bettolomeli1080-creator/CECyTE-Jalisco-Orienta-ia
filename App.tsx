
import React, { useState, useCallback } from 'react';
import { 
  Compass, 
  MapPin, 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Search,
  School,
  History,
  Briefcase
} from 'lucide-react';
import { AppState, UserProfile, Recommendation } from './types';
import { getCareerRecommendation } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.HOME);
  const [profile, setProfile] = useState<UserProfile>({
    location: '',
    interests: '',
    experience: '',
    skills: []
  });
  const [results, setResults] = useState<{ recommendations: Recommendation[]; sources: any[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startQuiz = () => setState(AppState.QUIZ);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState(AppState.LOADING);
    setError(null);
    try {
      const data = await getCareerRecommendation(profile);
      setResults(data);
      setState(AppState.RESULTS);
    } catch (err) {
      console.error(err);
      setError("Hubo un error procesando tu solicitud. Por favor intenta de nuevo.");
      setState(AppState.QUIZ);
    }
  };

  const handleSkillToggle = (skill: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.includes(skill) 
        ? prev.skills.filter(s => s !== skill) 
        : [...prev.skills, skill]
    }));
  };

  const commonSkills = ["Matemáticas", "Dibujo", "Liderazgo", "Tecnología", "Ciencias", "Creatividad", "Organización", "Atención al Cliente"];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-emerald-800 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setState(AppState.HOME)}>
            <div className="bg-amber-400 p-1.5 rounded-lg">
              <School className="w-6 h-6 text-emerald-900" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">CECYTE Jalisco <span className="text-amber-400 font-light">Orienta</span></h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="https://cecytejalisco.edu.mx" target="_blank" className="text-sm hover:text-amber-400 transition-colors">Portal Oficial</a>
            <button 
              onClick={startQuiz}
              className="bg-amber-500 hover:bg-amber-600 text-emerald-900 px-4 py-2 rounded-full text-sm font-bold transition-all shadow-md"
            >
              Iniciar Orientación
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {state === AppState.HOME && (
          <section className="relative overflow-hidden py-20 px-4">
            <div className="absolute top-0 left-0 w-full h-full bg-emerald-900 skew-y-3 origin-top-left -z-10 opacity-5"></div>
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
                <Sparkles className="w-4 h-4" />
                Nueva Plataforma de Orientación con IA
              </div>
              <h2 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
                Encuentra tu Futuro en el <span className="text-emerald-700">CECYTE Jalisco</span>
              </h2>
              <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
                Analizamos tu ubicación, tus gustos y habilidades para recomendarte la mejor carrera técnica y el plantel ideal para ti.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={startQuiz}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-xl hover:scale-105"
                >
                  Descubrir mi carrera <ArrowRight className="w-5 h-5" />
                </button>
                <a 
                  href="https://cecytejalisco.edu.mx/planteles" 
                  target="_blank"
                  className="bg-white border-2 border-slate-200 hover:border-emerald-700 text-slate-700 px-8 py-4 rounded-2xl font-bold text-lg transition-all"
                >
                  Ver Planteles
                </a>
              </div>
              
              <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                {[
                  { icon: <MapPin className="text-emerald-600" />, title: "Planteles en todo Jalisco", desc: "Contamos con presencia en todas las regiones del estado." },
                  { icon: <BookOpen className="text-emerald-600" />, title: "Carreras Técnicas", desc: "Oferta académica alineada a las necesidades del sector productivo." },
                  { icon: <CheckCircle2 className="text-emerald-600" />, title: "Título y Cédula", desc: "Al terminar obtienes tu bachillerato y título profesional técnico." }
                ].map((item, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
                      {item.icon}
                    </div>
                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {state === AppState.QUIZ && (
          <section className="py-12 px-4 max-w-3xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="bg-emerald-800 p-8 text-white">
                <h2 className="text-2xl font-bold mb-2">Háblanos de ti</h2>
                <p className="text-emerald-100 opacity-90">Completa este breve formulario para que nuestra IA analice tu perfil.</p>
              </div>
              
              <form onSubmit={handleSubmit} className="p-8 space-y-8">
                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    ¿En qué municipio o zona de Jalisco vives?
                  </label>
                  <input
                    required
                    type="text"
                    name="location"
                    value={profile.location}
                    onChange={handleInputChange}
                    placeholder="Ej. Tonalá, Puerto Vallarta, Zapopan Centro..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                    <Compass className="w-4 h-4 text-emerald-600" />
                    ¿Qué te gusta hacer en tu tiempo libre o qué temas te interesan?
                  </label>
                  <textarea
                    required
                    name="interests"
                    value={profile.interests}
                    onChange={handleInputChange}
                    placeholder="Ej. Armar computadoras, cocinar, cuidar niños, arreglar motores..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all h-24 resize-none"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-3">
                    <History className="w-4 h-4 text-emerald-600" />
                    ¿Tienes alguna experiencia previa? (Talleres, trabajos, ayuda en casa)
                  </label>
                  <textarea
                    name="experience"
                    value={profile.experience}
                    onChange={handleInputChange}
                    placeholder="Ej. He ayudado en el taller de mi papá, tomé un curso de diseño..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all h-24 resize-none"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-4">
                    <Briefcase className="w-4 h-4 text-emerald-600" />
                    Selecciona tus habilidades destacadas:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {commonSkills.map(skill => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleSkillToggle(skill)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          profile.skills.includes(skill)
                            ? 'bg-emerald-700 text-white border-emerald-700 shadow-md'
                            : 'bg-white text-slate-600 border border-slate-300 hover:border-emerald-400'
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-4 rounded-xl font-bold text-lg shadow-lg transition-all active:scale-[0.98]"
                >
                  Analizar mi perfil
                </button>
              </form>
            </div>
          </section>
        )}

        {state === AppState.LOADING && (
          <section className="py-20 flex flex-col items-center justify-center text-center">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-emerald-100 border-t-emerald-700 rounded-full animate-spin"></div>
              <Search className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-emerald-700" />
            </div>
            <h2 className="mt-8 text-2xl font-bold text-slate-900">Consultando con nuestra IA Orientadora</h2>
            <p className="mt-2 text-slate-500 max-w-xs">Buscando en la oferta educativa de CECYTE Jalisco y localizando los planteles más cercanos...</p>
          </section>
        )}

        {state === AppState.RESULTS && results && (
          <section className="py-12 px-4 max-w-5xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900">Tu Ruta de Éxito en CECYTE</h2>
                <p className="text-slate-600">Basado en tu perfil, estas son nuestras recomendaciones.</p>
              </div>
              <button 
                onClick={startQuiz}
                className="text-emerald-700 font-bold hover:underline"
              >
                Volver a intentar
              </button>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {results.recommendations.map((rec, i) => (
                <div key={i} className="bg-white rounded-3xl shadow-xl border border-emerald-100 overflow-hidden">
                  <div className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="bg-amber-100 p-3 rounded-2xl">
                          <Sparkles className="w-6 h-6 text-amber-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900">Análisis Personalizado</h3>
                      </div>
                    </div>
                    
                    <div className="prose prose-emerald max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {rec.description}
                    </div>

                    {results.sources && results.sources.length > 0 && (
                      <div className="mt-10 pt-8 border-t border-slate-100">
                        <h4 className="flex items-center gap-2 font-bold text-slate-900 mb-4">
                          <MapPin className="w-5 h-5 text-emerald-600" />
                          Referencias y Ubicaciones:
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {results.sources.map((source, idx) => (
                            source.maps && (
                              <a 
                                key={idx}
                                href={source.maps.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-4 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-all border border-emerald-100 group"
                              >
                                <div className="bg-white p-2 rounded-lg shadow-sm group-hover:scale-110 transition-transform">
                                  <MapPin className="w-4 h-4 text-emerald-700" />
                                </div>
                                <span className="text-sm font-semibold text-emerald-900 truncate">{source.maps.title}</span>
                              </a>
                            )
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-emerald-900 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
                    <div className="flex items-center gap-3">
                      <School className="w-6 h-6 text-amber-400" />
                      <span className="font-medium">¿Listo para inscribirte? Consulta requisitos oficiales.</span>
                    </div>
                    <a 
                      href="https://cecytejalisco.edu.mx/tramites" 
                      target="_blank"
                      className="bg-amber-400 hover:bg-amber-500 text-emerald-900 px-6 py-2.5 rounded-full font-bold transition-all shadow-md whitespace-nowrap"
                    >
                      Ver Trámites
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
              <div className="bg-emerald-700 p-1.5 rounded-lg">
                <School className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-lg">CECYTE Jalisco Orienta</span>
            </div>
            <p className="max-w-xs text-sm">
              Potenciando la educación técnica en el estado de Jalisco a través de tecnología inteligente.
            </p>
          </div>
          
          <div className="flex gap-8 text-sm">
            <div className="flex flex-col gap-2">
              <span className="text-white font-bold mb-2">Institución</span>
              <a href="https://cecytejalisco.edu.mx/nosotros" target="_blank" className="hover:text-emerald-400">Sobre nosotros</a>
              <a href="https://cecytejalisco.edu.mx/directorio" target="_blank" className="hover:text-emerald-400">Directorio</a>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-white font-bold mb-2">Recursos</span>
              <a href="https://cecytejalisco.edu.mx/calendario" target="_blank" className="hover:text-emerald-400">Calendario Escolar</a>
              <a href="https://cecytejalisco.edu.mx/becas" target="_blank" className="hover:text-emerald-400">Becas</a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-center text-xs">
          © {new Date().getFullYear()} CECYTE Jalisco. Información basada en el portal oficial cecytejalisco.edu.mx
        </div>
      </footer>
    </div>
  );
};

export default App;
