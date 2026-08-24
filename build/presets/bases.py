"""Base icon geometry — Lucide v1.33.0 (ISC), path fragments only.

Fragments carry no badge and no paint attributes beyond the accents marked with
{S3}/{F3}; the generator adds the badge and the <svg> wrapper. Keeping bases
badge-free is what lets one base serve several presets.
"""
BASES = {
 # health
 "heartPulse": '<path fill="var(--tm-i3, none)" d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/><path class="tm-accent" d="M3.22 13H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"{S2}/>',
 "stethoscope": '<path d="M11 2v2M5 2v2"{S3}/><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1"/><path d="M8 15a6 6 0 0 0 12 0v-3"/><circle class="tm-accent" cx="20" cy="10" r="2"{F2}/>',
 "pill": '<path fill="var(--tm-i3, none)" d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path class="tm-accent" d="m8.5 8.5 7 7"{S2}/>',
 "syringe": '<path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5"/><path class="tm-accent" d="m18 2 4 4M17 7l3-3M14 4l6 6"{S2}/><path d="m9 11 4 4M5 19l-3 3"{S3}/>',
 "thermometer": '<path fill="var(--tm-i3, none)" d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/>',
 "activity": '<path class="tm-accent" d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"{S2}/>',
 "bandage": '<rect x="2" y="6" width="20" height="12" rx="2" fill="var(--tm-i3, none)"/><path d="M18 6v12M6 6v12"{S3}/><path class="tm-accent" d="M10 10.01h.01M10 14.01h.01M14 10.01h.01M14 14.01h.01" stroke-width="2.5"{S2}/>',
 "ambulance": '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.684-.948l-1.923-.641a1 1 0 0 1-.578-.502l-1.539-3.076A1 1 0 0 0 16.382 8H14"{S3}/><path d="M9 18h6"{S3}/><path class="tm-accent" d="M10 10H6M8 8v4"{S2}/><g class="tm-wheels"{F3}><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></g>',
 "hospital": '<path d="M18 11h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2"/><path fill="var(--tm-i3, none)" d="M18 21V5a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16"/><path d="M14 21v-3a2 2 0 0 0-4 0v3"{S3}/><path class="tm-accent" d="M12 7v4M14 9h-4"{S2}/>',
 "dna": '<path d="M2 15c6.667-6 13.333 0 20-6"/><path class="tm-accent" d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993M9 22c1.798-1.998 2.518-3.995 2.807-5.993"{S2}/><path d="m10 16 1.5 1.5M14 8l-1.5-1.5M16.5 10.5l1 1M6.5 12.5l1 1"{S3}/>',
 "brain": '<path d="M12 18V5"{S3}/><path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5"/><path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517"/><path class="tm-accent" d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4"{S2}/>',
 "microscope": '<path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" fill="var(--tm-i3, none)"/><path d="M14 22a7 7 0 1 0 0-14h-1"/><path d="M6 18h8M3 22h18M9 14h2"{S3}/><path class="tm-accent" d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"{S2}/>',
 "testTube": '<path fill="var(--tm-i3, none)" d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5c-1.4 0-2.5-1.1-2.5-2.5V2"/><path class="tm-accent" d="M8.5 2h7M14.5 16h-5"{S2}/>',
 # travel
 "plane": '<path fill="var(--tm-i3, none)" d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
 "planeTakeoff": '<path class="tm-accent" d="M6.36 17.4 4 17l-2-4 1.1-.55a2 2 0 0 1 1.8 0l.17.1a2 2 0 0 0 1.8 0L8 12 5 6l.9-.45a2 2 0 0 1 2.09.2l4.02 3a2 2 0 0 0 2.1.2l4.19-2.06a2.41 2.41 0 0 1 1.73-.17L21 7a1.4 1.4 0 0 1 .87 1.99l-.38.76c-.23.46-.6.84-1.07 1.08L7.58 17.2a2 2 0 0 1-1.22.18Z"{S2}/><path d="M2 22h20"{S3}/>',
 "luggage": '<path fill="var(--tm-i3, none)" d="M6 20a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2"/><path class="tm-accent" d="M8 18V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v14"{S2}/><g class="tm-wheels"{F3}><circle cx="16" cy="20" r="2"/><circle cx="8" cy="20" r="2"/></g>',
 "bed": '<path d="M2 4v16"/><path fill="var(--tm-i3, none)" d="M2 8h18a2 2 0 0 1 2 2v10"/><path class="tm-accent" d="M2 17h20"{S2}/><path d="M6 8v9"{S3}/>',
 "map": '<path fill="var(--tm-i3, none)" d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path class="tm-accent" d="M15 5.764v15M9 3.236v15"{S2}/>',
 "compass": '<circle cx="12" cy="12" r="10" fill="var(--tm-i3, none)"/><path class="tm-accent" d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"{S2}/>',
 "car": '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><path d="M9 17h6"{S3}/><g class="tm-wheels"{F2}><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></g>',
 "bus": '<path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"/><path d="M8 6v6M15 6v6M2 12h19.6M9 18h5"{S3}/><g class="tm-wheels"{F2}><circle cx="7" cy="18" r="2"/><circle cx="16" cy="18" r="2"/></g>',
 "train": '<path fill="var(--tm-i3, none)" d="M9 19c-2.8 0-5-2.2-5-5v-4a8 8 0 0 1 16 0v4c0 2.8-2.2 5-5 5Z"/><path class="tm-accent" d="M8 3.1V7a4 4 0 0 0 8 0V3.1"{S2}/><path d="m9 15-1-1M15 15l1-1M8 19l-2 3M16 19l2 3"{S3}/>',
 "ship": '<path d="M19.38 20A11.6 11.6 0 0 0 21 14l-8.188-3.639a2 2 0 0 0-1.624 0L3 14a11.6 11.6 0 0 0 2.81 7.76"/><path fill="var(--tm-i3, none)" d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"/><path class="tm-accent" d="M12 10.189V14M12 2v3"{S2}/><path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1s1.2 1 2.5 1c2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"{S3}/>',
 "tent": '<path fill="var(--tm-i3, none)" d="M3.5 21 14 3l6.5 18z"/><path class="tm-accent" d="M15.5 21 12 15l-3.5 6"{S2}/><path d="M2 21h20"{S3}/>',
 "sun": '<circle cx="12" cy="12" r="4" fill="var(--tm-i3, none)"/><g class="tm-accent"{S2}><path d="M12 2v2M12 20v2M2 12h2M20 12h2"/><path d="m4.93 4.93 1.41 1.41M17.66 17.66l1.41 1.41M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></g>',
 "umbrella": '<path fill="var(--tm-i3, none)" d="M20.992 13a1 1 0 0 0 .97-1.274 10.284 10.284 0 0 0-19.923 0A1 1 0 0 0 3 13z"/><path class="tm-accent" d="M12 13v7a2 2 0 0 0 4 0M12 2v2"{S2}/>',
 "backpack": '<path fill="var(--tm-i3, none)" d="M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path class="tm-accent" d="M8 22v-6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6"{S2}/><path d="M8 10h8M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"{S3}/>',
 # education
 "graduationCap": '<path fill="var(--tm-i3, none)" d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path class="tm-accent" d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"{S2}/><path d="M22 10v6"{S3}/>',
 "bookOpen": '<path fill="var(--tm-i3, none)" d="M20.001 19A2 2 0 0022 17V5a2 2 0 0 0-1.999-2L16 3.002A5 5 0 0 0 12 5a5 5 0 0 0-4-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 1.999 2H8a5 5 0 0 1 4 2 5 5 0 0 1 4-2z"/><path class="tm-accent" d="M12 5v16"{S2}/>',
 "notebookPen": '<path d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4" fill="var(--tm-i3, none)"/><path d="M2 6h4M2 10h4M2 14h4M2 18h4"{S3}/><path class="tm-accent" d="M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"{S2}/>',
 "presentation": '<path fill="var(--tm-i3, none)" d="M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3"/><path d="M2 3h20"{S3}/><path class="tm-accent" d="m7 21 5-5 5 5"{S2}/>',
 "lightbulb": '<path fill="var(--tm-i3, none)" d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path class="tm-accent" d="M9 18h6M10 22h4"{S2}/>',
 # crm / business
 "building": '<path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"/><path fill="var(--tm-i3, none)" d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/><path class="tm-accent" d="M10 12h4M10 8h4"{S2}/><path d="M14 21v-3a2 2 0 0 0-4 0v3"{S3}/>',
 "briefcase": '<rect width="20" height="14" x="2" y="6" rx="2" fill="var(--tm-i3, none)"/><path class="tm-accent" d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"{S2}/>',
 "phoneCall": '<path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"/><g class="tm-accent"{S2}><path d="M13 2a9 9 0 0 1 9 9"/><path d="M13 6a5 5 0 0 1 5 5"/></g>',
 "contact": '<rect x="3" y="3" width="18" height="18" rx="2" fill="var(--tm-i3, none)"/><path d="M16 2v2M8 2v2"{S3}/><circle class="tm-accent" cx="12" cy="11" r="4"{S2}/><path d="M17.915 21a6 6 0 1 0-12 0"{S3}/>',
 "target": '<circle cx="12" cy="12" r="10" fill="var(--tm-i3, none)"/><circle cx="12" cy="12" r="6"{S3}/><circle class="tm-accent" cx="12" cy="12" r="2"{F2}/>',
 "trendUp": '<path class="tm-accent" d="m22 7-8.5 8.5-5-5L2 17"{S2}/><path d="M16 7h6v6"{S3}/>',
 "chartColumn": '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><g class="tm-accent"{S2}><path d="M8 17v-3"/><path d="M13 17V5"/><path d="M18 17V9"/></g>',
 "calendarDays": '<rect x="3" y="3" width="18" height="18" rx="2" fill="var(--tm-i3, none)"/><path d="M8 2v3M16 2v3M3 9h18"{S3}/><g class="tm-accent"{S2}><path d="M8 13h.01M12 13h.01M16 13h.01" stroke-width="2.5"/><path d="M8 17h.01M12 17h.01M16 17h.01" stroke-width="2.5"/></g>',
 # devops
 "gitBranch": '<path d="M15 6a9 9 0 0 0-9 9V3"/><g class="tm-accent"{F2}><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/></g>',
 "gitMerge": '<path d="M6 21V9a9 9 0 0 0 9 9"/><g class="tm-accent"{F2}><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/></g>',
 "gitPull": '<path d="M13 6h3a2 2 0 0 1 2 2v7"/><path d="M6 9v12"{S3}/><g class="tm-accent"{F2}><circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/></g>',
 "container": '<path fill="var(--tm-i3, none)" d="M22 7.7c0-.6-.4-1.2-.8-1.5l-6.3-3.9a1.72 1.72 0 0 0-1.7 0l-10.3 6c-.5.2-.9.8-.9 1.4v6.6c0 .5.4 1.2.8 1.5l6.3 3.9a1.72 1.72 0 0 0 1.7 0l10.3-6c.5-.3.9-1 .9-1.5Z"/><path class="tm-accent" d="M10 21.9V14L2.1 9.1M10 14l11.9-6.9"{S2}/>',
 "terminal": '<path class="tm-accent" d="m4 17 6-6-6-6"{S2}/><path d="M12 19h8"{S3}/>',
 "bug": '<path fill="var(--tm-i3, none)" d="M14 7a4 4 0 0 1 4 4v3a6 6 0 0 1-12 0v-3a4 4 0 0 1 4-4z"/><path d="M12 20v-9"{S3}/><g class="tm-accent"{S2}><path d="M14.12 3.88 16 2M8 2l1.88 1.88"/><path d="M22 13h-4M6 13H2"/><path d="M21 21a4 4 0 0 0-3.81-4M3 21a4 4 0 0 1 3.81-4"/></g>',
 "webhook": '<path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2"/><path class="tm-accent" d="m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06"{S2}/><path d="m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8"{S3}/>',
 "cpu": '<rect x="4" y="4" width="16" height="16" rx="2" fill="var(--tm-i3, none)"/><rect class="tm-accent" x="8" y="8" width="8" height="8" rx="1"{S2}/><g{S3}><path d="M12 2v2M17 2v2M7 2v2M12 20v2M17 20v2M7 20v2"/><path d="M2 12h2M2 17h2M2 7h2M20 12h2M20 17h2M20 7h2"/></g>',
 "hardDrive": '<path fill="var(--tm-i3, none)" d="M2.212 11.577a2 2 0 0 0-.212.896V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5.527a2 2 0 0 0-.212-.896L18.55 5.11A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><path d="M21.946 12.013H2.054"{S3}/><path class="tm-accent" d="M10 16h.01M6 16h.01" stroke-width="2.5"{S2}/>',
 "server": '<rect width="20" height="8" x="2" y="2" rx="2" ry="2" fill="var(--tm-i3, none)"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2" fill="var(--tm-i3, none)"/><g class="tm-accent"{S2}><path d="M6 6h.01M6 18h.01" stroke-width="2.5"/></g>',
 "cloud": '<path fill="var(--tm-i3, none)" d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
 # media
 "volume": '<path fill="var(--tm-i3, none)" d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><g class="tm-accent"{S2}><path d="M16 9a5 5 0 0 1 0 6"/><path d="M19.364 18.364a9 9 0 0 0 0-12.728"/></g>',
 "volumeX": '<path fill="var(--tm-i3, none)" d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"/><g class="tm-accent"{S2}><path d="m22 9-6 6"/><path d="m16 9 6 6"/></g>',
 "headphones": '<path class="tm-accent" d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"{S2}/>',
 "video": '<rect x="2" y="6" width="14" height="12" rx="2" fill="var(--tm-i3, none)"/><path class="tm-accent" d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"{S2}/>',
 "film": '<rect width="18" height="18" x="3" y="3" rx="2" fill="var(--tm-i3, none)"/><g class="tm-accent"{S2}><path d="M7 3v18M17 3v18"/></g><path d="M3 7.5h4M3 12h18M3 16.5h4M17 7.5h4M17 16.5h4"{S3}/>',
 "music": '<path d="M9 18V5l12-2v13"/><g class="tm-accent"{F2}><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></g>',
}
