import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/ui/AnimatedSection';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { GradientText } from '../components/ui/FloatingElements';
import { SafeMarkdown } from '../components/ui/SafeMarkdown';
import { useAuth, getAuthToken } from '../context/AuthContext';
import { ShoppingCart, Tags, Download, ChevronRight, AlertTriangle, Loader2, CreditCard } from 'lucide-react';

const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/7sY8wQ2et19Geak1qecIE01';

type StoreCategory = {
  slug: string;
  title: string;
  count: number;
};

type StoreWorkflow = {
  id?: string;
  categorySlug: string;
  categoryTitle: string;
  workflowSlug: string;
  name: string;
  fileName: string;
  description: string;
  integrations: string[];
  priceCents: number;
  currency: string;
  hasJson?: boolean;
  hasInstructions?: boolean;
};

type StoreCategoryDetail = {
  slug: string;
  title: string;
  count: number;
  workflows: StoreWorkflow[];
};

const getApiBaseUrl = () => {
  // @ts-ignore - Vite env
  return (import.meta.env.VITE_API_URL as string | undefined) || '/api';
};

const getStoreAssetsBaseUrl = () => {
  // @ts-ignore - Vite env
  return (import.meta.env.VITE_STORE_ASSETS_BASE_URL as string | undefined) || '';
};

const encodeFile = (fileName: string) => encodeURIComponent(fileName);
const decodeFile = (encoded: string) => decodeURIComponent(encoded);

export const Store: React.FC = () => {
  const { categorySlug, workflowFile } = useParams();
  const { isAuthenticated, user, setShowAuthModal, setAuthModalMode } = useAuth();
  const [categories, setCategories] = useState<StoreCategory[]>([]);
  const [categoryDetail, setCategoryDetail] = useState<StoreCategoryDetail | null>(null);
  const [workflowDetail, setWorkflowDetail] = useState<{ category: { slug: string; title: string }; workflow: StoreWorkflow } | null>(null);
  const [storeError, setStoreError] = useState<string>('');
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string>('');
  const [isPurchased, setIsPurchased] = useState(false);
  const [checkingPurchase, setCheckingPurchase] = useState(false);
  const [visibleWorkflows, setVisibleWorkflows] = useState(24);
  const [instructionsMd, setInstructionsMd] = useState<string>('');
  const [loadingInstructions, setLoadingInstructions] = useState(false);
  const [instructionsError, setInstructionsError] = useState<string>('');
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setStoreError('');
      setCategoryDetail(null);
      setWorkflowDetail(null);

      const apiBase = getApiBaseUrl();

      try {
        if (!categorySlug) {
          const res = await fetch(`${apiBase}/store/categories`);
          const json = await res.json().catch(() => null);
          if (!res.ok || !json?.success) {
            throw new Error(json?.message || `Failed to load store categories (${res.status})`);
          }
          if (!cancelled) setCategories(Array.isArray(json.data) ? json.data : []);
          return;
        }

        if (categorySlug && !workflowFile) {
          const res = await fetch(`${apiBase}/store/categories/${encodeURIComponent(categorySlug)}`);
          const json = await res.json().catch(() => null);
          if (!res.ok || !json?.success) {
            throw new Error(json?.message || `Failed to load category (${res.status})`);
          }
          if (!cancelled) setCategoryDetail(json.data);
          return;
        }

        if (categorySlug && workflowFile) {
          const res = await fetch(
            `${apiBase}/store/workflows/${encodeURIComponent(categorySlug)}/${encodeURIComponent(decodeFile(workflowFile))}`,
            undefined
          );
          const json = await res.json().catch(() => null);
          if (!res.ok || !json?.success) {
            throw new Error(json?.message || `Failed to load workflow (${res.status})`);
          }
          if (!cancelled) setWorkflowDetail(json.data);
          return;
        }
      } catch (e: any) {
        if (!cancelled) setStoreError(e?.message || 'Failed to load store catalog');
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [categorySlug, workflowFile]);

  // Reset pagination when entering a category
  useEffect(() => {
    if (categorySlug && !workflowFile) setVisibleWorkflows(24);
  }, [categorySlug, workflowFile]);

  const selectedCategory = useMemo(() => {
    if (!categorySlug) return null;
    if (workflowFile && workflowDetail?.category) return workflowDetail.category;
    if (categoryDetail) return { slug: categoryDetail.slug, title: categoryDetail.title };
    return null;
  }, [categorySlug, workflowFile, workflowDetail, categoryDetail]);

  const selectedWorkflow: StoreWorkflow | null = useMemo(() => {
    if (!categorySlug || !workflowFile) return null;
    return workflowDetail?.workflow || null;
  }, [categorySlug, workflowFile, workflowDetail]);

  // Check purchase status when workflow changes / user logs in
  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      setIsPurchased(false);

      if (!selectedWorkflow?.id || !isAuthenticated) return;

      setCheckingPurchase(true);
      const apiBase = getApiBaseUrl();
      try {
        const authToken = getAuthToken();
        const res = await fetch(`${apiBase}/store/purchase-status/${selectedWorkflow.id}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });
        const json = await res.json().catch(() => null);
        if (!cancelled && res.ok && json?.success) {
          setIsPurchased(!!json?.data?.purchased);
        }
      } finally {
        if (!cancelled) setCheckingPurchase(false);
      }
    };

    check();
    return () => {
      cancelled = true;
    };
  }, [selectedWorkflow?.id, isAuthenticated]);

  // Load instructions markdown (requires purchase)
  useEffect(() => {
    let cancelled = false;

    const loadInstructions = async () => {
      setInstructionsMd('');
      setInstructionsError('');

      if (!selectedWorkflow?.id) return;
      if (!isAuthenticated || !isPurchased) return;
      if (!selectedWorkflow.hasInstructions) return;
      if (!showInstructions) return;

      setLoadingInstructions(true);
      const apiBase = getApiBaseUrl();
      try {
        const authToken = getAuthToken();
        const res = await fetch(`${apiBase}/store/instructions/${selectedWorkflow.id}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });
        const json = await res.json().catch(() => null);
        if (!cancelled && res.ok && json?.success) {
          setInstructionsMd(String(json?.data?.instructionsMd || ''));
        } else if (!cancelled) {
          throw new Error(json?.message || `Failed to load instructions (${res.status})`);
        }
      } catch (e: any) {
        if (!cancelled) setInstructionsError(e?.message || 'Failed to load instructions');
      } finally {
        if (!cancelled) setLoadingInstructions(false);
      }
    };

    loadInstructions();
    return () => {
      cancelled = true;
    };
  }, [selectedWorkflow?.id, selectedWorkflow?.hasInstructions, isAuthenticated, isPurchased, showInstructions]);

  // Secure download handler: requires auth + purchase, fetches one-time token, triggers download
  const handleDownload = async () => {
    if (!selectedWorkflow?.id) return;

    if (!isAuthenticated) {
      setAuthModalMode('login');
      setShowAuthModal(true);
      return;
    }

    if (!isPurchased) {
      setDownloadError('Please complete your purchase first.');
      return;
    }

    if (!selectedWorkflow.hasJson) {
      setDownloadError('Workflow JSON is not available for this item yet.');
      return;
    }

    setDownloading(true);
    setDownloadError('');

    const apiBase = getApiBaseUrl();

    try {
      // Step 1: Request a one-time download token
      const authToken = getAuthToken();
      const tokenRes = await fetch(`${apiBase}/store/download-token/${selectedWorkflow.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      const tokenJson = await tokenRes.json().catch(() => null);
      if (!tokenRes.ok || !tokenJson?.success) {
        throw new Error(tokenJson?.message || 'Failed to get download token');
      }

      // Step 2: Trigger the download via the token endpoint
      const downloadToken = tokenJson.data.token;
      window.location.href = `${apiBase}/store/download/${downloadToken}`;
    } catch (e: any) {
      setDownloadError(e?.message || 'Download failed');
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadInstructions = async () => {
    if (!selectedWorkflow?.id) return;

    if (!isAuthenticated) {
      setAuthModalMode('login');
      setShowAuthModal(true);
      return;
    }

    if (!isPurchased) {
      setDownloadError('Please complete your purchase first.');
      return;
    }

    if (!selectedWorkflow.hasInstructions) {
      setDownloadError('Instructions are not available for this workflow yet.');
      return;
    }

    setDownloading(true);
    setDownloadError('');

    const apiBase = getApiBaseUrl();

    try {
      const authToken = getAuthToken();
      const tokenRes = await fetch(`${apiBase}/store/download-token/${selectedWorkflow.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      const tokenJson = await tokenRes.json().catch(() => null);
      if (!tokenRes.ok || !tokenJson?.success) {
        throw new Error(tokenJson?.message || 'Failed to get download token');
      }

      const downloadToken = tokenJson.data.token;
      window.location.href = `${apiBase}/store/download-instructions/${downloadToken}`;
    } catch (e: any) {
      setDownloadError(e?.message || 'Download failed');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Layout>
      <SEO
        title="Store | Viktron"
        description="Browse categorized n8n workflows. View details and download workflow JSON."
      />

      <div className="pt-24">
        <AnimatedSection className="relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/70">
                <ShoppingCart className="h-4 w-4 text-sky-400" />
                n8n workflow store
              </div>

              <h1 className="mt-6 text-4xl sm:text-5xl font-bold tracking-tight text-white">
                <GradientText>Workflows</GradientText> you can ship today
              </h1>

              <p className="mt-4 text-lg text-white/70 leading-relaxed">
                Browse workflows by category, open a workflow to see details, and download the JSON to import into n8n.
              </p>

              <div className="mt-8 flex flex-row gap-3 overflow-x-auto">
                <Link to="/demos/workflow-automation">
                  <Button variant="primary" size="lg" className="whitespace-nowrap">Demo</Button>
                </Link>
                <Link to="/contact">
                  <Button variant="secondary" size="lg" className="whitespace-nowrap">
                    Contact us
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {storeError ? (
              <GlassCard className="p-6">
                <div className="flex items-start gap-3 text-white/80">
                  <AlertTriangle className="h-5 w-5 text-amber-400" />
                  <div>
                    <div className="font-semibold">Could not load workflow catalog</div>
                    <div className="mt-1 text-sm text-white/60">{storeError}</div>
                  </div>
                </div>
              </GlassCard>
            ) : workflowFile && selectedWorkflow && selectedCategory ? (
              <GlassCard className="p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm text-white/50">Workflow</div>
                    <h2 className="mt-1 text-2xl font-bold text-white">{selectedWorkflow.name}</h2>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-3xl font-bold text-sky-400">$39</span>
                      <span className="text-sm text-white/50">one-time purchase</span>
                    </div>
                    {selectedWorkflow.description ? (
                      <p className="mt-3 text-white/70 leading-relaxed">{selectedWorkflow.description}</p>
                    ) : (
                      <p className="mt-3 text-white/50">No description provided.</p>
                    )}
                  </div>
                  <div className="shrink-0">
                    <Link to={`/store/${selectedCategory.slug}`}>
                      <Button variant="secondary" size="md">
                        Back
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center gap-2 text-sm text-white/70">
                    <Tags className="h-4 w-4 text-sky-400" />
                    Key Integrations
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(selectedWorkflow.integrations.length ? selectedWorkflow.integrations : ['—']).map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-white/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  {selectedWorkflow.hasJson || selectedWorkflow.hasInstructions ? (
                    <>
                      {!isPurchased && (
                        <a
                          href={`${STRIPE_PAYMENT_LINK}?client_reference_id=${user?.id && selectedWorkflow.id ? `${user.id}:${selectedWorkflow.id}` : ''}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            if (!isAuthenticated) {
                              e.preventDefault();
                              setAuthModalMode('login');
                              setShowAuthModal(true);
                            }
                          }}
                        >
                          <Button variant="primary" size="md" className="w-full sm:w-auto">
                            Buy Now
                          </Button>
                        </a>
                      )}

                      {isAuthenticated && isPurchased && (
                        <>
                          {selectedWorkflow.hasJson && (
                            <Button
                              variant="secondary"
                              size="md"
                              onClick={handleDownload}
                              disabled={downloading}
                            >
                              {downloading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Download className="h-4 w-4" />
                              )}
                              Download JSON
                            </Button>
                          )}

                          {selectedWorkflow.hasInstructions && (
                            <Button
                              variant="secondary"
                              size="md"
                              onClick={handleDownloadInstructions}
                              disabled={downloading}
                            >
                              {downloading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Download className="h-4 w-4" />
                              )}
                              Download setup (.md)
                            </Button>
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    <Button variant="primary" size="md" className="w-full sm:w-auto" disabled>
                      <CreditCard className="h-4 w-4" />
                      Coming soon — $39
                    </Button>
                  )}

                  <Link to="/contact">
                    <Button variant="secondary" size="md" className="w-full sm:w-auto">
                      Need help importing?
                    </Button>
                  </Link>
                </div>

                {downloadError && (
                  <div className="mt-3 text-sm text-red-400">{downloadError}</div>
                )}

                {isAuthenticated && isPurchased && selectedWorkflow.hasInstructions && (
                  <div className="mt-6 border-t border-white/10 pt-6">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm text-white/70">Setup instructions</div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowInstructions((v) => !v)}
                      >
                        {showInstructions ? 'Hide' : 'View'}
                      </Button>
                    </div>

                    {showInstructions && (
                      <div className="mt-4">
                        {loadingInstructions ? (
                          <div className="text-sm text-white/60">Loading instructions…</div>
                        ) : instructionsError ? (
                          <div className="text-sm text-red-400">{instructionsError}</div>
                        ) : instructionsMd ? (
                          <div className="text-sm text-white/80 leading-relaxed">
                            <SafeMarkdown assetBaseUrl={getStoreAssetsBaseUrl() || undefined}>
                              {instructionsMd}
                            </SafeMarkdown>
                          </div>
                        ) : (
                          <div className="text-sm text-white/50">No instructions found.</div>
                        )}
                      </div>
                    )}
                  </div>
                )}

              </GlassCard>
            ) : categoryDetail ? (
              <>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="text-sm text-white/50">Category</div>
                    <h2 className="mt-1 text-2xl font-bold text-white">{categoryDetail.title}</h2>
                    <div className="mt-1 text-sm text-white/50">
                      {categoryDetail.workflows.length} workflows listed
                    </div>
                  </div>
                  <Link to="/store">
                    <Button variant="secondary" size="md">All categories</Button>
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {(categoryDetail.workflows || []).slice(0, visibleWorkflows).map((w) => (
                    <Link key={`${w.categorySlug}:${w.fileName}`} to={`/store/${categoryDetail.slug}/${encodeFile(w.fileName)}`}>
                      <GlassCard className="p-5 hover:bg-white/10 transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="text-lg font-semibold text-white">{w.name}</div>
                            <div className="mt-1 text-sm text-white/60 line-clamp-2">{w.description || 'No description provided.'}</div>
                            {!!w.integrations.length && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {w.integrations.slice(0, 6).map((tag) => (
                                  <span
                                    key={`${w.fileName}:${tag}`}
                                    className="px-2.5 py-1 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-white/70"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="shrink-0 flex flex-col items-end gap-1">
                            <div className="text-lg font-bold text-sky-400">$39</div>
                            <div className="text-xs text-white/50">Buy now</div>
                          </div>
                        </div>
                      </GlassCard>
                    </Link>
                  ))}
                </div>

                {categoryDetail.workflows.length > visibleWorkflows && (
                  <div className="mt-6 flex justify-center">
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={() => setVisibleWorkflows((v) => v + 24)}
                    >
                      Load more
                    </Button>
                  </div>
                )}

                <div className="mt-10">
                  <GlassCard className="p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <div className="text-sm text-white/50">Custom</div>
                        <div className="mt-1 text-xl font-semibold text-white">Need a custom workflow?</div>
                        <div className="mt-2 text-sm text-white/60">
                          Tell us what you want to automate and we’ll build it in n8n.
                        </div>
                      </div>
                      <Link to={`/contact?subject=${encodeURIComponent('Custom n8n workflow request')}`}>
                        <Button variant="primary" size="md" className="whitespace-nowrap">
                          Contact for custom workflow
                        </Button>
                      </Link>
                    </div>
                  </GlassCard>
                </div>
              </>
            ) : (
              <StaggerContainer>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categories.map((cat) => (
                    <StaggerItem key={cat.slug}>
                      <Link to={`/store/${cat.slug}`}>
                        <GlassCard className="h-full p-6 hover:bg-white/10 transition-colors">
                          <div className="text-sm text-white/50">Category</div>
                          <div className="mt-2 text-xl font-semibold text-white">{cat.title}</div>
                          <div className="mt-2 text-sm text-white/60">
                            {(cat.count ?? 0).toLocaleString()} workflows
                          </div>
                        </GlassCard>
                      </Link>
                    </StaggerItem>
                  ))}
                </div>

                <div className="mt-10">
                  <GlassCard className="p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <div className="text-sm text-white/50">Custom</div>
                        <div className="mt-1 text-xl font-semibold text-white">Need a custom workflow?</div>
                        <div className="mt-2 text-sm text-white/60">
                          Tell us what you want to automate and we’ll build it in n8n.
                        </div>
                      </div>
                      <Link to={`/contact?subject=${encodeURIComponent('Custom n8n workflow request')}`}>
                        <Button variant="primary" size="md" className="whitespace-nowrap">
                          Contact for custom workflow
                        </Button>
                      </Link>
                    </div>
                  </GlassCard>
                </div>
              </StaggerContainer>
            )}
          </div>
        </AnimatedSection>
      </div>
    </Layout>
  );
};
