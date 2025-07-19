import { useRef, useEffect, useState } from "react";

export default function SineCurveSkillGap({ skills = [] }) {
    const containerRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(600); // Fallback width

    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
            }
        };

        updateWidth(); // Initial
        window.addEventListener("resize", updateWidth);
        return () => window.removeEventListener("resize", updateWidth);
    }, []);

    const height = 200;
    const amplitude = 20;
    const waveLength = 200;

    const spacing = waveLength;
    const numWaves = Math.ceil(skills.length / 2);
    const svgWidth = numWaves * spacing + 50; // dynamic based on skills

    let pathD = "";
    let peaks = [];

    for (let i = 0; i <= numWaves * spacing; i++) {
        const x = i;
        const y = height / 2 - amplitude * Math.sin((2 * Math.PI * i) / waveLength);
        pathD += `${i === 0 ? "M" : " L"} ${x},${y}`;

        if (i % waveLength === waveLength / 4) {
            const skillIndex = peaks.length;
            if (skills[skillIndex]) {
                peaks.push({ x, y: height / 2 - amplitude, label: skills[skillIndex] });
            }
        }

        if (i % waveLength === (3 * waveLength) / 4) {
            const skillIndex = peaks.length;
            if (skills[skillIndex]) {
                peaks.push({ x, y: height / 2 + amplitude, label: skills[skillIndex] });
            }
        }
    }

    const MarkerIcon = ({ x, y }) => (
        <g transform={`translate(${x - 8}, ${y - 28})`} className="animate-pulse">
            <path
                d="M8 0C3.58 0 0 3.58 0 8c0 4.42 8 16 8 16s8-11.58 8-16c0-4.42-3.58-8-8-8zM8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"
                fill="#ef4444"
            />
        </g>
    );

    const StartFlag = ({ x, y }) => (
        <g transform={`translate(${x}, ${y - 35})`}>
            {/* Flag Pole */}
            <rect x="0" y="0" width="3" height="40" fill="#4B5563" />
            {/* Flag */}
            <path d="M3,0 Q20,8 3,16" fill="#10b981" /> {/* Tailwind emerald-500 */}
        </g>
    );

    const FinishFlag = ({ x, y }) => (
        <g transform={`translate(${x - 10}, ${y - 50})`}>
            {/* Flag pole */}
            <rect x="0" y="0" width="3" height="50" fill="#1f2937" />

            {/* Fluttering flag */}
            <path
                d="M3,0 Q18,8 3,16 Q18,24 3,32"
                fill="#fbbf24" // Tailwind amber-400
            />

            {/* Optional sparkle/star */}
            <circle cx="20" cy="-5" r="3" fill="#facc15">
                <animate
                    attributeName="r"
                    values="2;4;2"
                    dur="1.2s"
                    repeatCount="indefinite"
                />
            </circle>
        </g>
    );


    return (
        <div
            ref={containerRef}
            className="w-full overflow-x-auto py-4 scrollbar-thin scrollbar-thumb-slate-400 flex justify-center items-center"
        >
            <svg
                width={svgWidth}
                height={height}
                viewBox={`0 0 ${svgWidth} ${height}`}
                className="drop-shadow-lg"
            >
                <defs>
                    <filter id="gravel-texture" x="0" y="0">
                        <feTurbulence
                            type="turbulence"
                            baseFrequency="0.05"
                            numOctaves="2"
                            result="turbulence"
                        />
                        <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="1" />
                    </filter>
                </defs>

                {/* Road Edge */}
                <path
                    d={pathD}
                    fill="none"
                    stroke="#374151"
                    strokeWidth="10"
                    strokeLinecap="round"
                />

                {/* Main Path */}
                <path
                    d={pathD}
                    fill="none"
                    stroke="#6b7280"
                    strokeWidth="6"
                    strokeLinecap="round"
                    filter="url(#gravel-texture)"
                />

                <StartFlag x={0} y={height / 2} />
                <FinishFlag x={numWaves * spacing} y={height / 2} />

                {/* Skill Markers */}
                {peaks.map((peak, index) => (
                    <g key={index} className="cursor-pointer">
                        <MarkerIcon x={peak.x} y={peak.y} />
                        <text
                            x={peak.x}
                            y={peak.y + (peak.y < height / 2 ? -40 : 35)}
                            textAnchor="middle"
                            className="text-[14px] font-medium fill-gray-800"
                        >
                            {peak.label}
                        </text>
                    </g>
                ))}
            </svg>
        </div>
    );
}
