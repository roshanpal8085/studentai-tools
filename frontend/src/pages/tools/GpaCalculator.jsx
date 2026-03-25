import { useState } from 'react';
import SEO from '../../components/SEO';
import { Calculator, Plus, Trash2, CheckCircle, HelpCircle, GraduationCap, Award, BookOpen, Star, TrendingUp } from 'lucide-react';

const GpaCalculator = () => {
  const [courses, setCourses] = useState([{ id: 1, grade: 'A', credits: '3' }]);
  const gradeScale = { 'A': 4.0, 'A-': 3.7, 'B+': 3.3, 'B': 3.0, 'B-': 2.7, 'C+': 2.3, 'C': 2.0, 'C-': 1.7, 'D+': 1.3, 'D': 1.0, 'F': 0.0 };

  const addCourse = () => {
    setCourses([...courses, { id: Date.now(), grade: 'A', credits: '3' }]);
  };

  const removeCourse = (id) => {
    if (courses.length === 1) return;
    setCourses(courses.filter(c => c.id !== id));
  };

  const updateCourse = (id, field, value) => {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const calculateGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;
    courses.forEach(c => {
      const credits = parseFloat(c.credits) || 0;
      totalPoints += gradeScale[c.grade] * credits;
      totalCredits += credits;
    });
    return totalCredits === 0 ? '0.00' : (totalPoints / totalCredits).toFixed(2);
  };

  const currentGPA = parseFloat(calculateGPA());

  return (
    <div className="min-h-screen pt-24 pb-12 bg-slate-50 dark:bg-slate-900">
      <SEO 
        title="Free Online GPA Calculator - College & High School" 
        description="Calculate your semester, cumulative, and major GPA instantly. Features standard 4.0 scales, custom credits, and academic performance tracking for students."
        keywords="gpa calculator, college gpa, weighted gpa, cumulative gpa calculator, grade point average tool"
        schema={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "Academic GPA Calculator",
          "operatingSystem": "Web",
          "applicationCategory": "EducationalApplication",
          "description": "Standard 4.0 scale GPA calculator for college and high school students with weighted credit support.",
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "INR" }
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 mb-4 transition-transform hover:-translate-y-1 hover:shadow-lg shadow-indigo-600/20">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
            Academic <span className="text-gradient">GPA Calculator</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Track your scholarly progress with precision. Enter your course credits and anticipated grades to forecast your academic standing.
          </p>
        </div>

        <div className="glass-card rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 h-full">
            {/* Input Section */}
            <div className="lg:col-span-2 p-10 md:p-14 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 bg-white/30 dark:bg-slate-950/20 backdrop-blur-md">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200 dark:border-slate-800">
                 <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-500" /> Current Semester Courses
                 </h2>
                 <span className="text-xs font-black uppercase tracking-widest text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{courses.length} courses</span>
              </div>
              
              <div className="space-y-4 mb-10 max-h-[400px] overflow-y-auto custom-scrollbar pr-4">
                {courses.map((course, index) => (
                  <div key={course.id} className="flex flex-wrap sm:flex-nowrap gap-4 items-center animate-in fade-in slide-in-from-left-4 duration-500 bg-white dark:bg-slate-900/80 p-5 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 shadow-sm relative group">
                    <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-indigo-500 text-white flex items-center justify-center rounded-full text-[10px] font-bold shadow-md">
                      {index + 1}
                    </div>
                    <div className="flex-grow pl-4">
                      <label className="block text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2">Grade Received</label>
                      <div className="relative">
                        <select 
                          value={course.grade}
                          onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                          className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-bold transition-all appearance-none cursor-pointer"
                        >
                          {Object.keys(gradeScale).map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                      </div>
                    </div>
                    <div className="w-full sm:w-32">
                      <label className="block text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2">Credit Hours</label>
                      <input 
                        type="number" 
                        min="0"
                        step="0.5"
                        value={course.credits}
                        onChange={(e) => updateCourse(course.id, 'credits', e.target.value)}
                        className="w-full px-5 py-3 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-bold transition-all"
                        placeholder="3"
                      />
                    </div>
                    <button 
                      onClick={() => removeCourse(course.id)}
                      className="mt-6 sm:mt-0 p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all self-end mb-[2px]"
                      title="Remove Course"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>

              <button 
                onClick={addCourse}
                className="w-full border-2 border-dashed border-indigo-200 dark:border-indigo-800/50 text-indigo-600 dark:text-indigo-400 font-black hover:bg-indigo-50 dark:hover:bg-indigo-900/10 py-5 rounded-[1.5rem] transition-all flex items-center justify-center gap-2 group shadow-inner"
              >
                <Plus className="w-5 h-5 group-hover:scale-125 transition-transform" /> Add Another Course Block
              </button>
            </div>

            {/* Results Section */}
            <div className="p-10 md:p-14 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col justify-center relative overflow-hidden">
               <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
               
               <div className="text-center relative z-10 mb-10">
                 <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-black uppercase tracking-widest mb-6 border border-indigo-200 dark:border-indigo-800">Semester Assessment</span>
                 
                 <div className="relative inline-block mb-4">
                    <div className="text-7xl lg:text-8xl font-black text-slate-900 dark:text-white tracking-tighter">
                      {calculateGPA()}
                    </div>
                    <div className="absolute top-0 -right-8 text-indigo-500 animate-bounce">
                       {currentGPA >= 3.8 && <Star className="w-6 h-6 fill-indigo-500" />}
                    </div>
                 </div>
                 <div className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-sm mt-2">Calculated GPA</div>
               </div>

               <div className={`p-6 rounded-3xl border-2 transition-colors duration-500 ${
                 currentGPA >= 3.8 ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-300' :
                 currentGPA >= 3.0 ? 'bg-indigo-50 border-indigo-200 text-indigo-800 dark:bg-indigo-900/20 dark:border-indigo-800 dark:text-indigo-300' :
                 'bg-slate-100 border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
               }`}>
                 <div className="flex items-start gap-4">
                   <Award className="w-8 h-8 opacity-80 flex-shrink-0" />
                   <div>
                     <h4 className="font-extrabold mb-1">Status Analysis</h4>
                     <p className="text-sm font-medium opacity-90 leading-snug">
                       {currentGPA >= 3.8 ? "Outstanding academic performance. You're solidly in Dean's List and Honors territory. Maintain this trajectory." : 
                        currentGPA >= 3.0 ? "Solid academic standing. You are maintaining a good B-average or higher, keeping you competitive." : 
                        "Keep pushing forward. Review your lower grades and consider utilizing our Study Planner and Homework Helper tools to assist."}
                     </p>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Ad Space Placement */}
        <div className="w-full h-24 glass-card rounded-2xl flex items-center justify-center text-slate-400 text-sm mb-16 border border-dashed border-slate-300 dark:border-slate-700/50">
          Ad Placement - Educational Tools Hub
        </div>

        {/* Informational Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 mb-24 py-16 border-t border-slate-200 dark:border-slate-800">
          <div className="space-y-12">
            <h2 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">Academic <span className="text-indigo-600">Forecasting</span></h2>
            <div className="space-y-10">
              {[
                { title: 'Standard 4.0 Scale', desc: 'Pre-configured with the universally accepted 4.0 grade scale (A = 4.0, B = 3.0) including plus/minus increments for exact accuracy.', icon: CheckCircle },
                { title: 'Credit Weighting', desc: 'Unlike simple averages, this calculator correctly weighs your grades against course credits, treating a 4-credit course as more impactful than a 1-credit lab.', icon: TrendingUp },
                { title: 'Goal Setting', desc: 'Use the calculator ahead of finals to determine exactly what grades you need to achieve or maintain your target cumulative GPA.', icon: Calculator }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                   <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-inner text-primary">
                     <item.icon className="w-7 h-7" />
                   </div>
                   <div>
                     <h3 className="text-xl font-bold dark:text-white mb-2">{item.title}</h3>
                     <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                   </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-[3rem] p-10 md:p-14 relative overflow-hidden h-fit">
            <h2 className="text-2xl font-extrabold dark:text-white mb-8">Calculator FAQ</h2>
            <div className="space-y-6">
              {[
                { q: 'How is GPA actually calculated?', a: 'GPA is calculated by multiplying the grade value (e.g., A = 4.0) by the course credits to get "Quality Points". You then divide the total Quality Points by the total Credits attempted.' },
                { q: 'What if my school doesn\'t use +/- grades?', a: 'Simply select the solid letter grades (A, B, C) in the dropdown and ignore the plus/minus options. The calculation will remain perfectly accurate.' },
                { q: 'Can I calculate cumulative GPA?', a: 'Yes! Treat your entire past academic history as one "Course". Input your current cumulative GPA as the grade, and your total earned credits as the credit hours. Then add your new courses below it.' }
              ].map((faq, i) => (
                <div key={i} className="pb-5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <h3 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
                    <HelpCircle className="w-4 h-4 text-indigo-500" /> {faq.q}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default GpaCalculator;
