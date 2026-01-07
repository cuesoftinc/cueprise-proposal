/* ==========================================
   MSN Energy Demo - Interactive JavaScript
   ========================================== */

// ==========================================
// Mobile Sidebar Toggle
// ==========================================
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
}

function closeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
}

document.addEventListener('DOMContentLoaded', function() {
    
    // ==========================================
    // Navigation Logic
    // ==========================================
    const navItems = document.querySelectorAll('.nav-item');
    const modules = document.querySelectorAll('.module');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetModule = item.dataset.module;
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            // Show target module
            modules.forEach(mod => mod.classList.remove('active'));
            const target = document.getElementById(`module-${targetModule}`);
            if (target) {
                target.classList.add('active');
            }

            // Close sidebar on mobile after navigation
            if (window.innerWidth <= 768) {
                closeSidebar();
            }
        });
    });

    // ==========================================
    // Initialize Charts
    // ==========================================
    initVolumeChart();
    initFGCChart();
    initAnalyticsCharts();

    function initVolumeChart() {
        const ctx = document.getElementById('volumeChart');
        if (!ctx) return;

        const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Nominated',
                        data: [4200, 4350, 4100, 4500, 4300, 3800, 4100],
                        borderColor: '#6366f1',
                        backgroundColor: 'rgba(99, 102, 241, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                        pointBackgroundColor: '#6366f1'
                    },
                    {
                        label: 'Delivered',
                        data: [4150, 4300, 4050, 4420, 4250, 3750, 4050],
                        borderColor: '#14b8a6',
                        backgroundColor: 'rgba(20, 184, 166, 0.1)',
                        fill: true,
                        tension: 0.4,
                        pointRadius: 4,
                        pointBackgroundColor: '#14b8a6'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'end',
                        labels: {
                            usePointStyle: true,
                            pointStyle: 'circle',
                            padding: 20,
                            font: {
                                family: 'Inter',
                                size: 11
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                family: 'Inter',
                                size: 11
                            },
                            color: '#64748b'
                        }
                    },
                    y: {
                        beginAtZero: false,
                        min: 3500,
                        grid: {
                            color: '#f1f5f9'
                        },
                        ticks: {
                            font: {
                                family: 'Inter',
                                size: 11
                            },
                            color: '#64748b',
                            callback: function(value) {
                                return value.toLocaleString() + ' MMscf';
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    function initFGCChart() {
        const ctx = document.getElementById('fgcChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Recovered', 'Flared'],
                datasets: [{
                    data: [87, 13],
                    backgroundColor: ['#10b981', '#ef4444'],
                    borderWidth: 0,
                    cutout: '70%'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            pointStyle: 'circle',
                            padding: 15,
                            font: {
                                family: 'Inter',
                                size: 11
                            }
                        }
                    }
                }
            },
            plugins: [{
                id: 'centerText',
                beforeDraw: function(chart) {
                    const width = chart.width;
                    const height = chart.height;
                    const ctx = chart.ctx;
                    
                    ctx.restore();
                    const fontSize = (height / 100).toFixed(2);
                    ctx.font = fontSize + 'em Inter';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = '#1e293b';
                    
                    const text = '87%';
                    const textX = Math.round((width - ctx.measureText(text).width) / 2);
                    const textY = height / 2 - 10;
                    
                    ctx.fillText(text, textX, textY);
                    
                    ctx.font = '0.8em Inter';
                    ctx.fillStyle = '#64748b';
                    const subText = 'Recovery';
                    const subTextX = Math.round((width - ctx.measureText(subText).width) / 2);
                    ctx.fillText(subText, subTextX, textY + 20);
                    
                    ctx.save();
                }
            }]
        });
    }

    function initAnalyticsCharts() {
        // Quarterly Performance Chart
        const analyticsCtx = document.getElementById('analyticsChart');
        if (analyticsCtx) {
            new Chart(analyticsCtx, {
                type: 'bar',
                data: {
                    labels: ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025'],
                    datasets: [{
                        label: 'Revenue (₦B)',
                        data: [5.2, 6.1, 7.1, 8.7],
                        backgroundColor: '#6366f1',
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        x: { grid: { display: false } },
                        y: {
                            grid: { color: '#f1f5f9' },
                            ticks: {
                                callback: function(value) { return '₦' + value + 'B'; }
                            }
                        }
                    }
                }
            });
        }

        // Revenue by Segment Chart
        const segmentCtx = document.getElementById('segmentChart');
        if (segmentCtx) {
            new Chart(segmentCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Gas Trading', 'FGC', 'Projects'],
                    datasets: [{
                        data: [72, 18, 10],
                        backgroundColor: ['#6366f1', '#10b981', '#f59e0b'],
                        borderWidth: 0,
                        cutout: '60%'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                usePointStyle: true,
                                pointStyle: 'circle',
                                padding: 12,
                                font: { family: 'Inter', size: 10 }
                            }
                        }
                    }
                }
            });
        }
    }

    // ==========================================
    // Interactive Elements
    // ==========================================
    
    // Chart tab switching
    const chartTabs = document.querySelectorAll('.chart-tabs button');
    chartTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            chartTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            // In a real app, this would update the chart data
        });
    });

    // Table row hover effects are handled via CSS

    // Demo notification
    console.log('🚀 MSN Energy Demo loaded successfully');
    console.log('📊 Navigate through modules using the sidebar');
});

// ==========================================
// Demo Helper Functions
// ==========================================

function showNotification(message, type = 'info') {
    // Placeholder for notification system
    console.log(`[${type.toUpperCase()}] ${message}`);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: 'NGN',
        minimumFractionDigits: 0
    }).format(amount);
}

function formatNumber(num) {
    return new Intl.NumberFormat('en-NG').format(num);
}
