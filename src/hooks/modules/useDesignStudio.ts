import { useState, useRef } from 'react';
import { ProjectEntity, ScanAnalysis } from '../../core/schemas/entities';
import * as api from '../../core/api/contract';
import { guidedScanInstructions } from '../../core/ux-engine/engine';
import { useAppStore } from '../../store/useAppStore';

export const useDesignStudio = (
    setActiveTab: (tab: any) => void, 
    addToast: (msg: string, type?: 'success' | 'error' | 'info') => void
) => {
    // Use Global State for Projects
    const { projects, publicProjects, setProjects, setPublicProjects, addProject, updateProject } = useAppStore();

    const [selectedProject, setSelectedProject] = useState<ProjectEntity | null>(null);
    const [showProjectDetailsModal, setShowProjectDetailsModal] = useState(false);
    
    // Scanning
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [currentScanStep, setCurrentScanStep] = useState(0);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [paymentError, setPaymentError] = useState<string | null>(null);
    const [scanAnalysis, setScanAnalysis] = useState<ScanAnalysis | null>(null);
    const scanIntervalRef = useRef<number | null>(null);

    // Creation & Minting
    const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
    const [showMintNftModal, setShowMintNftModal] = useState(false);
    const [projectToMint, setProjectToMint] = useState<ProjectEntity | null>(null);
    const [showShareModal, setShowShareModal] = useState(false);
    const [projectToShare, setProjectToShare] = useState<ProjectEntity | null>(null);

    const fetchProjects = async () => {
        const [userProjects, publicProjs] = await Promise.all([
            api.listProjects(), 
            api.listPublicProjects()
        ]);
        setProjects(userProjects);
        setPublicProjects(publicProjs);
    };

    // Scanning Logic
    const startScan = () => { 
        setIsScanning(true); 
        setCurrentScanStep(0); 
        setScanProgress(0); 
        const totalDuration = 8000; 
        const stepDuration = totalDuration / guidedScanInstructions.length; 
        scanIntervalRef.current = window.setInterval(() => { 
            setCurrentScanStep(prevStep => { 
                const nextStep = prevStep + 1; 
                if (nextStep >= guidedScanInstructions.length) { 
                    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current); 
                    setIsScanning(false); 
                    setScanAnalysis({ dimensions: '15x20ft', style: 'Modern', lighting: 'Natural (South)', summary: 'Spacious room with good potential for open-plan living.' }); 
                    setShowPaymentModal(true); 
                    return prevStep; 
                } 
                return nextStep; 
            }); 
            setScanProgress(prev => prev + (100 / guidedScanInstructions.length)); 
        }, stepDuration); 
    };
    
    const cancelScan = () => { 
        if (scanIntervalRef.current) { clearInterval(scanIntervalRef.current); } 
        setIsScanning(false); 
        setScanProgress(0); 
        setCurrentScanStep(0); 
    };

    const confirmPayment = async () => { 
        setIsProcessingPayment(true); 
        setPaymentError(null);
        try {
          const newProject = await api.generateModelFromScan(); 
          addProject(newProject); // Update Global Store
          setIsProcessingPayment(false); 
          setShowPaymentModal(false); 
          setActiveTab('design');
          addToast("Scan processed successfully!", "success");
        } catch (e) {
            setPaymentError("Transaction failed. Please ensure you have sufficient Test-Pi.");
            setIsProcessingPayment(false);
        }
    };
    const cancelPayment = () => setShowPaymentModal(false);

    // Project Interaction
    const handleProjectInteraction = async (project: ProjectEntity) => { 
        setSelectedProject(project); 
        setShowProjectDetailsModal(true); 
    };

    const handleModifyProject = async (project: ProjectEntity) => {
        const updated = await api.incrementProjectModification(project.id);
        const merged = { ...updated, ...project }; 
        updateProject(merged); // Update Global Store
        setSelectedProject(merged);
    };

    // Creation
    const openCreateProjectModal = () => setShowCreateProjectModal(true);
    const closeCreateProjectModal = () => setShowCreateProjectModal(false);
    const handleCreateProject = async (data: any) => {
        const newProject = await api.generateModelFromScan(); // Reuse mock generator
        newProject.name = `${data.roomType} - ${data.style}`;
        addProject(newProject); // Update Global Store
        addToast("New design generated!", "success");
    };

    // Minting
    const openMintNftModal = (project: ProjectEntity) => { setProjectToMint(project); setShowMintNftModal(true); };
    const closeMintNftModal = () => { setProjectToMint(null); setShowMintNftModal(false); };
    const handleMintNft = async (projectId: string) => { 
        const updatedProject = await api.mintProjectAsNft(projectId); 
        updateProject(updatedProject); // Update Global Store
        addToast("NFT Minted!", "success"); 
    };

    // Sharing
    const openShareModal = (project: ProjectEntity) => { setProjectToShare(project); setShowShareModal(true); };
    const closeShareModal = () => { setShowShareModal(false); setProjectToShare(null); };
    const handleShareProject = async (caption: string) => {
        if (!projectToShare) return;
        const result = await api.shareToPiFeed(projectToShare.id, caption);
        if (result.success) {
            addToast(result.message, "success");
        } else {
            addToast(result.message, "info");
        }
    };

    const currentScanInstruction = guidedScanInstructions[currentScanStep];

    return {
        projects, publicProjects,
        selectedProject, setSelectedProject,
        showProjectDetailsModal, setShowProjectDetailsModal,
        handleProjectInteraction, handleModifyProject,
        isScanning, scanProgress, currentScanInstruction, startScan, cancelScan,
        showPaymentModal, confirmPayment, cancelPayment, isProcessingPayment, paymentError, scanAnalysis,
        showCreateProjectModal, openCreateProjectModal, closeCreateProjectModal, handleCreateProject,
        showMintNftModal, projectToMint, openMintNftModal, closeMintNftModal, handleMintNft,
        showShareModal, projectToShare, openShareModal, closeShareModal, handleShareProject,
        fetchProjects
    };
};
