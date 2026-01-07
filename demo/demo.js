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
        });
    });

    // Module sub-tabs
    initModuleTabs();

    // Search functionality
    initSearchFunctionality();

    // Demo notification
    console.log('🚀 MSN Energy Demo loaded successfully');
    console.log('📊 Navigate through modules using the sidebar');
});

// ==========================================
// Modal System
// ==========================================
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = '';
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        closeAllModals();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeAllModals();
    }
});

// ==========================================
// Toast Notification System
// ==========================================
function showToast(title, message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const iconMap = {
        success: 'ph-duotone ph-check-circle',
        error: 'ph-duotone ph-x-circle',
        warning: 'ph-duotone ph-warning',
        info: 'ph-duotone ph-info'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="toast-icon ${iconMap[type]}"></i>
        <div class="toast-content">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="ph ph-x"></i>
        </button>
    `;

    container.appendChild(toast);

    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 10);

    // Auto remove
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

// ==========================================
// Module Sub-Tabs
// ==========================================
function initModuleTabs() {
    document.querySelectorAll('.module-tabs').forEach(tabContainer => {
        const tabs = tabContainer.querySelectorAll('.module-tab');
        const moduleSection = tabContainer.closest('.module');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.tab;
                
                // Update active tab
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Show target content
                if (moduleSection) {
                    moduleSection.querySelectorAll('.tab-content').forEach(content => {
                        content.classList.remove('active');
                    });
                    const target = moduleSection.querySelector(`#${targetTab}`);
                    if (target) target.classList.add('active');
                }
            });
        });
    });
}

// ==========================================
// Search Functionality
// ==========================================
function initSearchFunctionality() {
    // Global search
    const globalSearch = document.querySelector('.search-box input');
    if (globalSearch) {
        globalSearch.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            if (query.length >= 2) {
                console.log(`Searching for: ${query}`);
                // In production, this would search across modules
            }
        });
    }

    // Table search
    document.querySelectorAll('.search-inline input').forEach(input => {
        input.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const tableCard = e.target.closest('.table-card');
            if (!tableCard) return;

            const table = tableCard.querySelector('.data-table');
            if (!table) return;

            const rows = table.querySelectorAll('tbody tr');
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(query) ? '' : 'none';
            });
        });
    });
}

// ==========================================
// Form Handlers
// ==========================================
function handleNominationSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    showToast('Nomination Created', `New nomination for ${formData.get('offtaker')} submitted successfully.`, 'success');
    closeModal('nomination-modal');
    form.reset();
}

function handleLicenseSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    showToast('License Added', `${formData.get('licenseName')} has been added to the License Vault.`, 'success');
    closeModal('license-modal');
    form.reset();
}

function handleEntrySubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    showToast('Journal Entry Created', `Entry for ${formatCurrency(formData.get('amount'))} posted successfully.`, 'success');
    closeModal('entry-modal');
    form.reset();
}

function handleEmployeeSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    showToast('Employee Added', `${formData.get('firstName')} ${formData.get('lastName')} has been added.`, 'success');
    closeModal('employee-modal');
    form.reset();
}

function handleRequisitionSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    showToast('Requisition Submitted', `Requisition for ${formatCurrency(formData.get('amount'))} submitted for approval.`, 'success');
    closeModal('requisition-modal');
    form.reset();
}

function handleDocumentUpload(e) {
    e.preventDefault();
    
    showToast('Document Uploaded', 'Your document has been uploaded and is pending review.', 'success');
    closeModal('document-modal');
}

// ==========================================
// Action Handlers
// ==========================================
function reconcileNomination(id) {
    showToast('Reconciliation Complete', `Nomination ${id} has been reconciled successfully.`, 'success');
}

function renewLicense(name) {
    showToast('Renewal Initiated', `Renewal process for ${name} has been started.`, 'info');
}

function viewDetails(type, id) {
    openModal(`${type}-detail-modal`);
}

function downloadContract(id) {
    showToast('Download Started', `Contract ${id} is being downloaded.`, 'info');
}

function exportReport(type) {
    showToast('Export Started', `${type} report is being generated and will download shortly.`, 'info');
}

function approveRequisition(id) {
    showToast('Approved', `Requisition ${id} has been approved.`, 'success');
}

function rejectRequisition(id) {
    showToast('Rejected', `Requisition ${id} has been rejected.`, 'error');
}

// ==========================================
// Invoice Multi-Item Functions
// ==========================================
let invoiceItemCount = 1;

function addInvoiceItem() {
    invoiceItemCount++;
    const container = document.getElementById('invoice-items-container');
    const newItem = document.createElement('div');
    newItem.className = 'invoice-item';
    newItem.dataset.item = invoiceItemCount;
    newItem.innerHTML = `
        <div class="form-group" style="flex: 2;">
            <input type="text" class="form-input" name="item_desc_${invoiceItemCount}" placeholder="Description" required>
        </div>
        <div class="form-group">
            <input type="number" class="form-input item-volume" name="item_volume_${invoiceItemCount}" placeholder="Volume" oninput="updateInvoiceTotal()" required>
        </div>
        <div class="form-group">
            <input type="number" class="form-input item-rate" name="item_rate_${invoiceItemCount}" placeholder="Rate" oninput="updateInvoiceTotal()" required>
        </div>
        <div class="form-group item-subtotal">
            <span class="subtotal-label">₦0</span>
        </div>
        <button type="button" class="remove-item" onclick="removeInvoiceItem(this)">
            <i class="ph ph-x"></i>
        </button>
    `;
    container.appendChild(newItem);
    showToast('Item Added', `Line item ${invoiceItemCount} added to invoice.`, 'info');
}

function removeInvoiceItem(button) {
    const item = button.closest('.invoice-item');
    item.remove();
    updateInvoiceTotal();
    showToast('Item Removed', 'Line item removed from invoice.', 'info');
}

function updateInvoiceTotal() {
    let grandTotal = 0;
    const items = document.querySelectorAll('.invoice-item');
    
    items.forEach(item => {
        const volume = parseFloat(item.querySelector('.item-volume')?.value) || 0;
        const rate = parseFloat(item.querySelector('.item-rate')?.value) || 0;
        const subtotal = volume * rate;
        
        const subtotalLabel = item.querySelector('.subtotal-label');
        if (subtotalLabel) {
            subtotalLabel.textContent = formatCurrency(subtotal);
        }
        grandTotal += subtotal;
    });
    
    document.getElementById('invoice-grand-total').textContent = formatCurrency(grandTotal);
}

function handleInvoiceSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    // Calculate total from all items
    let total = 0;
    let itemCount = 0;
    const items = document.querySelectorAll('.invoice-item');
    items.forEach(item => {
        const volume = parseFloat(item.querySelector('.item-volume')?.value) || 0;
        const rate = parseFloat(item.querySelector('.item-rate')?.value) || 0;
        total += volume * rate;
        itemCount++;
    });
    
    showToast('Invoice Generated', `Invoice for ${formData.get('customer')} with ${itemCount} item(s) - ${formatCurrency(total)} created successfully.`, 'success');
    closeModal('invoice-modal');
    form.reset();
    
    // Reset to single item
    document.getElementById('invoice-items-container').innerHTML = `
        <div class="invoice-item" data-item="1">
            <div class="form-group" style="flex: 2;">
                <input type="text" class="form-input" name="item_desc_1" placeholder="Description (e.g. Gas supply - January)" required>
            </div>
            <div class="form-group">
                <input type="number" class="form-input item-volume" name="item_volume_1" placeholder="Volume (MMscf)" oninput="updateInvoiceTotal()" required>
            </div>
            <div class="form-group">
                <input type="number" class="form-input item-rate" name="item_rate_1" placeholder="Rate (₦/MMscf)" oninput="updateInvoiceTotal()" required>
            </div>
            <div class="form-group item-subtotal">
                <span class="subtotal-label">₦0</span>
            </div>
        </div>
    `;
    document.getElementById('invoice-grand-total').textContent = '₦0';
    invoiceItemCount = 1;
}

// ==========================================
// Demo Helper Functions
// ==========================================
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

function formatDate(date) {
    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    }).format(new Date(date));
}

// ==========================================
// Simulated Data Actions
// ==========================================
function refreshData(module) {
    showToast('Data Refreshed', `${module} data has been refreshed.`, 'info');
}

function generateInvoice(id) {
    showToast('Invoice Generated', `Invoice for nomination ${id} has been created.`, 'success');
}

function markAsReviewed(id) {
    showToast('Marked as Reviewed', `Item ${id} has been marked as reviewed.`, 'success');
}

// ==========================================
// Chart Period Switching
// ==========================================
function switchChartPeriod(button, period) {
    // Update active state
    const chartTabs = button.parentElement;
    chartTabs.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    
    // Show toast with period info
    const periodLabels = {
        'day': 'Daily',
        'week': 'Weekly', 
        'month': 'Monthly'
    };
    showToast('Chart Updated', `Showing ${periodLabels[period]} volume reconciliation data.`, 'info');
    
    // In a real app, this would update the chart data
    // For demo, we simulate a brief loading state
}

// ==========================================
// View More / Navigation
// ==========================================
function viewMore(module) {
    // Navigate to the full module
    const navItem = document.querySelector(`[data-module="${module}"]`);
    if (navItem) {
        navItem.click();
        showToast('Navigation', `Viewing all ${module} data.`, 'info');
    }
}

// ==========================================
// Additional Form Handlers
// ==========================================
function handleWaybillSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const waybillId = 'WB-2026-' + String(Math.floor(Math.random() * 9000) + 1000);
    
    showToast('Waybill Created', `${waybillId} from ${formData.get('origin')} to ${formData.get('destination')} created successfully.`, 'success');
    closeModal('waybill-modal');
    form.reset();
}

function handleFilterSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const status = formData.get('status') || 'all';
    
    showToast('Filters Applied', `Showing ${status} licenses.`, 'info');
    closeModal('filter-modal');
}

function handleAccountSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    showToast('Account Created', `Account ${formData.get('code')} - ${formData.get('name')} added successfully.`, 'success');
    closeModal('account-modal');
    form.reset();
}
