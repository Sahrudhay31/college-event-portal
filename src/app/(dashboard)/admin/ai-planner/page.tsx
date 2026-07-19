'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function AiPlannerPage() {
    const router = useRouter();
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [plan, setPlan] = useState<any>(null);
    const [loadingText, setLoadingText] = useState('');

    const handleCreateEvent = () => {
        if (!plan) return;
        const params = new URLSearchParams({
            title: plan.title || '',
            description: plan.marketing?.socialMedia || '',
            venue: plan.venues?.[0]?.name || ''
        });
        router.push(`/admin/events/create?${params.toString()}`);
    };

    const generatePlan = async () => {
        if (!prompt) return;
        setIsGenerating(true);
        setPlan(null);
        
        const steps = [
            "Analyzing requirements...",
            "Estimating budget & resources...",
            "Scouting venue suggestions...",
            "Drafting marketing materials...",
            "Finalizing AI event plan..."
        ];

        // Start step animation loop
        let currentStep = 0;
        setLoadingText(steps[0]);
        const stepInterval = setInterval(() => {
            currentStep = (currentStep + 1) % steps.length;
            setLoadingText(steps[currentStep]);
        }, 1500);

        try {
            const response = await fetch('/api/ai-planner', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to generate plan');
            }

            setPlan(data.plan);
        } catch (error: any) {
            alert(error.message);
        } finally {
            clearInterval(stepInterval);
            setIsGenerating(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="text-3xl">✨</span> AI Event Planner
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Describe your dream event in plain text, and let the AI instantly generate the budget, timeline, marketing materials, and logistics.
                </p>
            </div>

            <Card>
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        What kind of event are you planning?
                    </label>
                    <textarea 
                        className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[120px]"
                        placeholder="e.g. Conduct a 24-hour Hackathon for 300 students focusing on AI and Web3..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                    />
                    <div className="flex justify-end">
                        <Button 
                            onClick={generatePlan} 
                            disabled={!prompt || isGenerating}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-none shadow-lg px-6"
                        >
                            {isGenerating ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    {loadingText}
                                </div>
                            ) : (
                                <span className="flex items-center gap-2">✨ Generate Event Plan</span>
                            )}
                        </Button>
                    </div>
                </div>
            </Card>

            {plan && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        
                        {/* Budget & Volunteers */}
                        <div className="space-y-6">
                            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-100 dark:border-green-800">
                                <h3 className="text-lg font-bold text-green-800 dark:text-green-400 mb-4 flex items-center gap-2">
                                    💰 Estimated Budget: {plan.totalBudget}
                                </h3>
                                <ul className="space-y-3">
                                    {plan.budget.map((b: any, i: number) => (
                                        <li key={i} className="flex justify-between items-center text-gray-700 dark:text-gray-300 border-b border-green-200/50 dark:border-green-800/50 pb-2 last:border-0 last:pb-0">
                                            <span>{b.item}</span>
                                            <span className="font-semibold">{b.cost}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Card>

                            <Card>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    🙋 Volunteers & Staffing
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                                    {plan.volunteers}
                                </p>
                            </Card>
                            
                            <Card>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    🏛️ Venue Suggestions
                                </h3>
                                <div className="space-y-4">
                                    {plan.venues.map((v: any, i: number) => (
                                        <div key={i} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <h4 className="font-semibold text-gray-900 dark:text-white text-lg">{v.name}</h4>
                                            <div className="mt-2 space-y-1 text-sm">
                                                <p className="text-green-600 dark:text-green-400 flex items-start gap-2">
                                                    <span className="mt-0.5">✅</span> {v.pros}
                                                </p>
                                                <p className="text-red-600 dark:text-red-400 flex items-start gap-2">
                                                    <span className="mt-0.5">⚠️</span> {v.cons}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>

                        {/* Timeline & Marketing */}
                        <div className="space-y-6">
                            <Card>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    📅 Execution Timeline
                                </h3>
                                <div className="relative border-l-2 border-indigo-200 dark:border-indigo-800 ml-3 space-y-6">
                                    {plan.timeline.map((t: any, i: number) => (
                                        <div key={i} className="pl-6 relative">
                                            <div className="absolute w-3 h-3 bg-indigo-500 rounded-full -left-[7px] top-1.5 ring-4 ring-white dark:ring-gray-800"></div>
                                            <h4 className="font-bold text-indigo-600 dark:text-indigo-400">{t.time}</h4>
                                            <p className="text-gray-600 dark:text-gray-300 mt-1">{t.task}</p>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            <Card>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    📢 AI Marketing Assets
                                </h3>
                                
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Social Media Caption</h4>
                                        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 italic">
                                            "{plan.marketing.socialMedia}"
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Email Draft</h4>
                                        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 whitespace-pre-line text-sm font-mono">
                                            {plan.marketing.email}
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Poster Inspiration</h4>
                                        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300 whitespace-pre-line text-sm">
                                            {plan.marketing.poster}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                    
                    <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-800">
                        <Button 
                            onClick={handleCreateEvent}
                            className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 border-none shadow-xl px-8 py-3 text-lg rounded-full"
                        >
                            🚀 Create This Event
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
