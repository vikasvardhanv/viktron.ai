import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AlertTriangle, ChevronRight, CreditCard, Download, Loader2, ShoppingCart, Tags } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { SEO } from '../components/ui/SEO';
import { AnimatedSection, StaggerContainer, StaggerItem } from '../components/ui/AnimatedSection';
import { SafeMarkdown } from '../components/ui/SafeMarkdown';
import { Button } from '../components/ui/Button';
import { getAuthToken, useAuth } from '../context/AuthContext';

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
  return (import.meta.env.VITE_API_URL as string | undefined) || '/api';
};

const getStoreAssetsBaseUrl = () => {
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
  const [storeError, setStoreError] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState('');
  const [isPurchased, setIsPurchased] = useState(false);
  const [visibleWorkflows, setVisibleWorkflows] = useState(24);
  const [instructionsMd, setInstructionsMd] = useState('');
  const [loadingInstructions, setLoadingInstructions] = useState(false);
  const [instructionsError, setInstructionsError] = useState('');
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
          const response = await fetch(`${apiBase}/store/categories`);
          const json = await response.json().catch(() => null);
          if (!response.ok || !json?.success) throw new Error(json?.message || `Failed to load categories (${response.status})`);
          if (!cancelled) setCategories(Array.isArray(json.data) ? json.data : []);
          return;
        }

        if (!workflowFile) {
          const response = await fetch(`${apiBase}/store/categories/${encodeURIComponent(categorySlug)}`);
          const json = await response.json().catch(() => null);
          if (!response.ok || !json?.success) throw new Error(json?.message || `Failed to load category (${response.status})`);
          if (!cancelled) setCategoryDetail(json.data);
          return;
        }

        const response = await fetch(
          `${apiBase}/store/workflows/${encodeURIComponent(categorySlug)}/${encodeURIComponent(decodeFile(workflowFile))}`
        );
        const json = await response.json().catch(() => null);
        if (!response.ok || !json?.success) throw new Error(json?.message || `Failed to load workflow (${response.status})`);
        if (!cancelled) setWorkflowDetail(json.data);
      } catch (error: any) {
        if (!cancelled) setStoreError(error?.message || 'Failed to load store');
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [categorySlug, workflowFile]);

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

  useEffect(() => {
    let cancelled = false;

    const checkPurchase = async () => {
      setIsPurchased(false);
      if (!selectedWorkflow?.id || !isAuthenticated) return;

      const apiBase = getApiBaseUrl();
      try {
        const authToken = getAuthToken();
        const response = await fetch(`${apiBase}/store/purchase-status/${selectedWorkflow.id}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const json = await response.json().catch(() => null);
        if (!cancelled && response.ok && json?.success) {
          setIsPurchased(!!json?.data?.purchased);
        }
      } catch {
        // Ignore purchase check failures
      }
    };

    checkPurchase();
    return () => {
      cancelled = true;
    };
  }, [selectedWorkflow?.id, isAuthenticated]);

  useEffect(() => {
    let cancelled = false;

    const loadInstructions = async () => {
      setInstructionsMd('');
      setInstructionsError('');

      if (!selectedWorkflow?.id || !selectedWorkflow.hasInstructions) return;
      if (!isAuthenticated || !isPurchased || !showInstructions) return;

      setLoadingInstructions(true);
      const apiBase = getApiBaseUrl();
      try {
        const authToken = getAuthToken();
        const response = await fetch(`${apiBase}/store/instructions/${selectedWorkflow.id}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const json = await response.json().catch(() => null);
        if (!response.ok || !json?.success) throw new Error(json?.message || `Failed to load instructions (${response.status})`);
        if (!cancelled) setInstructionsMd(String(json?.data?.instructionsMd || ''));
      } catch (error: any) {
        if (!cancelled) setInstructionsError(error?.message || 'Failed to load instructions');
      } finally {
        if (!cancelled) setLoadingInstructions(false);
      }
    };

    loadInstructions();
    return () => {
      cancelled = true;
    };
  }, [selectedWorkflow?.id, selectedWorkflow?.hasInstructions, isAuthenticated, isPurchased, showInstructions]);

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

    try {
      const apiBase = getApiBaseUrl();
      const authToken = getAuthToken();

      const tokenResponse = await fetch(`${apiBase}/store/download-token/${selectedWorkflow.id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
      const tokenJson = await tokenResponse.json().catch(() => null);
      if (!tokenResponse.ok || !tokenJson?.success) throw new Error(tokenJson?.message || 'Failed to get download token');

      window.location.href = `${apiBase}/store/download/${tokenJson.data.token}`;
    } catch (error: any) {
      setDownloadError(error?.message || 'Download failed');
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

    try {
      const apiBase = getApiBaseUrl();
      const authToken = getAuthToken();

      const tokenResponse = await fetch(`${apiBase}/store/download-token/${selectedWorkflow.id}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
      const tokenJson = await tokenResponse.json().catch(() => null);
      if (!tokenResponse.ok || !tokenJson?.success) throw new Error(tokenJson?.message || 'Failed to get download token');

      window.location.href = `${apiBase}/store/download-instructions/${tokenJson.data.token}`;
    } catch (error: any) {
      setDownloadError(error?.message || 'Download failed');
    } finally {
      setDownloading(false);
    }
  };

  const purchaseUrl =
    user?.id && selectedWorkflow?.id
      ? `${STRIPE_PAYMENT_LINK}?client_reference_id=${user.id}:${selectedWorkflow.id}`
      : STRIPE_PAYMENT_LINK;

  return (
    <Layout>
      <SEO
        title="Store | Viktron"
        description="Browse categorized n8n workflows. View details and purchase workflow assets."
        url="/store"
      />

      <section className="pt-32 pb-10 px-4">
        <div className="container-custom">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#d4deeb] bg-[#f8fbff] px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#60718c]">
              <ShoppingCart className="h-4 w-4 text-[#3768e8]" />
              Workflow Store
            </div>
            <h1 className="mt-6 text-5xl sm:text-7xl font-semibold tracking-tight text-[#12223e]">Ready-to-deploy workflows.</h1>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-[#52637e]">
              Browse by category, inspect integrations, and download paid workflow files with setup documentation.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/demos/workflow-automation">
                <Button>See Workflow Demo</Button>
              </Link>
              <Link to="/contact">
                <Button variant="secondary">Contact Us</Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="pb-20 px-4">
        <div className="container-custom">
          {storeError ? (
            <div className="rounded-2xl border border-[#f0d4b3] bg-[#fff8f0] p-4">
              <div className="flex items-start gap-2 text-[#91511a]">
                <AlertTriangle className="h-5 w-5 mt-0.5" />
                <div>
                  <p className="font-semibold">Could not load workflow catalog</p>
                  <p className="mt-1 text-sm">{storeError}</p>
                </div>
              </div>
            </div>
          ) : workflowFile && selectedWorkflow && selectedCategory ? (
            <div className="rounded-3xl border border-[#d8e2ef] bg-white p-6 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7084a1]">Workflow</p>
                  <h2 className="mt-2 text-3xl font-semibold text-[#12223e]">{selectedWorkflow.name}</h2>
                  <p className="mt-3 max-w-3xl text-[#54657f] leading-relaxed">
                    {selectedWorkflow.description || 'No description provided.'}
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-3xl font-semibold text-[#2c4f94]">$39</span>
                    <span className="text-sm text-[#6b7d98]">one-time purchase</span>
                  </div>
                </div>
                <Link to={`/store/${selectedCategory.slug}`}>
                  <Button variant="secondary">Back to category</Button>
                </Link>
              </div>

              <div className="mt-6 rounded-2xl border border-[#d8e2ef] bg-[#f8fbff] p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#2d4f95]">
                  <Tags className="h-4 w-4" />
                  Integrations
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(selectedWorkflow.integrations.length ? selectedWorkflow.integrations : ['—']).map((integration) => (
                    <span
                      key={`${selectedWorkflow.fileName}-${integration}`}
                      className="rounded-full border border-[#d7e1ef] bg-white px-2.5 py-1 text-xs text-[#5d6f8d]"
                    >
                      {integration}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {(selectedWorkflow.hasJson || selectedWorkflow.hasInstructions) && !isPurchased ? (
                  <a
                    href={purchaseUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(event) => {
                      if (isAuthenticated) return;
                      event.preventDefault();
                      setAuthModalMode('login');
                      setShowAuthModal(true);
                    }}
                  >
                    <Button>Buy now</Button>
                  </a>
                ) : null}

                {isAuthenticated && isPurchased && selectedWorkflow.hasJson ? (
                  <Button variant="secondary" onClick={handleDownload} disabled={downloading}>
                    {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                    Download JSON
                  </Button>
                ) : null}

                {isAuthenticated && isPurchased && selectedWorkflow.hasInstructions ? (
                  <Button variant="secondary" onClick={handleDownloadInstructions} disabled={downloading}>
                    {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                    Download setup (.md)
                  </Button>
                ) : null}

                {!selectedWorkflow.hasJson && !selectedWorkflow.hasInstructions ? (
                  <Button disabled>
                    <CreditCard className="h-4 w-4" />
                    Coming soon
                  </Button>
                ) : null}

                <Link to="/contact">
                  <Button variant="secondary">Need help importing?</Button>
                </Link>
              </div>

              {downloadError ? <p className="mt-3 text-sm text-[#c03f4e]">{downloadError}</p> : null}

              {isAuthenticated && isPurchased && selectedWorkflow.hasInstructions ? (
                <div className="mt-7 rounded-2xl border border-[#d8e2ef] bg-[#f8fbff] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-[#1e3255]">Setup instructions</p>
                    <Button variant="ghost" size="sm" onClick={() => setShowInstructions((prev) => !prev)}>
                      {showInstructions ? 'Hide' : 'View'}
                    </Button>
                  </div>

                  {showInstructions ? (
                    <div className="mt-4 text-sm leading-relaxed text-[#334a6e]">
                      {loadingInstructions ? (
                        <p className="text-[#5f7190]">Loading instructions…</p>
                      ) : instructionsError ? (
                        <p className="text-[#c03f4e]">{instructionsError}</p>
                      ) : instructionsMd ? (
                        <SafeMarkdown assetBaseUrl={getStoreAssetsBaseUrl() || undefined}>{instructionsMd}</SafeMarkdown>
                      ) : (
                        <p className="text-[#5f7190]">No instructions found.</p>
                      )}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : categoryDetail ? (
            <>
              <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7084a1]">Category</p>
                  <h2 className="mt-2 text-3xl font-semibold text-[#12223e]">{categoryDetail.title}</h2>
                  <p className="mt-1 text-sm text-[#5f7190]">{categoryDetail.workflows.length} workflows listed</p>
                </div>
                <Link to="/store">
                  <Button variant="secondary">All categories</Button>
                </Link>
              </div>

              <div className="space-y-3">
                {(categoryDetail.workflows || []).slice(0, visibleWorkflows).map((workflow) => (
                  <Link key={`${workflow.categorySlug}:${workflow.fileName}`} to={`/store/${categoryDetail.slug}/${encodeFile(workflow.fileName)}`}>
                    <article className="rounded-2xl border border-[#d8e2ef] bg-white p-4 hover:bg-[#f9fbff] transition">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-semibold text-[#12223e]">{workflow.name}</h3>
                          <p className="mt-1 max-w-4xl text-sm text-[#566885] line-clamp-2">
                            {workflow.description || 'No description provided.'}
                          </p>
                          {!!workflow.integrations.length && (
                            <div className="mt-3 flex flex-wrap gap-2">
                              {workflow.integrations.slice(0, 6).map((integration) => (
                                <span
                                  key={`${workflow.fileName}-${integration}`}
                                  className="rounded-full border border-[#d7e1ef] bg-[#f8fbff] px-2.5 py-1 text-xs text-[#5d6f8d]"
                                >
                                  {integration}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-semibold text-[#2d4f95]">$39</p>
                          <p className="mt-1 text-xs text-[#6f83a1]">View details</p>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              {categoryDetail.workflows.length > visibleWorkflows ? (
                <div className="mt-6 flex justify-center">
                  <Button variant="secondary" onClick={() => setVisibleWorkflows((prev) => prev + 24)}>
                    Load more
                  </Button>
                </div>
              ) : null}

              <div className="mt-8 rounded-2xl border border-[#d8e2ef] bg-[#f8fbff] p-5">
                <h3 className="text-xl font-semibold text-[#12223e]">Need a custom workflow?</h3>
                <p className="mt-2 text-[#556781]">
                  Share your automation requirements and we’ll build and document a tailored n8n flow.
                </p>
                <div className="mt-4">
                  <Link to={`/contact?subject=${encodeURIComponent('Custom n8n workflow request')}`}>
                    <Button>Contact for Custom Workflow</Button>
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <>
              <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => (
                  <StaggerItem key={category.slug}>
                    <Link to={`/store/${category.slug}`} className="block h-full">
                      <div className="card h-full p-5">
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#7084a1]">Category</p>
                        <h3 className="mt-3 text-xl font-semibold text-[#12223e]">{category.title}</h3>
                        <p className="mt-2 text-sm text-[#5f7190]">{(category.count ?? 0).toLocaleString()} workflows</p>
                        <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#2d4f95]">
                          Explore
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerContainer>

              <div className="mt-8 rounded-2xl border border-[#d8e2ef] bg-[#f8fbff] p-5">
                <h3 className="text-xl font-semibold text-[#12223e]">Need a custom workflow?</h3>
                <p className="mt-2 text-[#556781]">
                  Tell us what to automate and we’ll design, build, and ship the full n8n workflow.
                </p>
                <div className="mt-4">
                  <Link to={`/contact?subject=${encodeURIComponent('Custom n8n workflow request')}`}>
                    <Button>Contact for Custom Workflow</Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};
