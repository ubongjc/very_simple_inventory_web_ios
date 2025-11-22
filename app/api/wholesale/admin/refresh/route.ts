import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

/**
 * POST /api/wholesale/admin/refresh
 *
 * Trigger a manual crawl/refresh of wholesale supplier data.
 *
 * Request Body:
 * - manual_refresh: true
 * - sources: Optional array of specific sources to crawl
 * - states: Optional array of specific states to focus on
 * - full_crawl: Optional boolean for full vs incremental crawl
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const {
      manual_refresh,
      sources,
      states,
      full_crawl = false,
    } = body;

    // Generate unique run ID
    const runId = `run_${new Date().toISOString().replace(/[:.]/g, "_")}`;

    // Default sources if not specified
    const sourcesToCrawl = sources || [
      "maps",
      "directory",
      "marketplace",
      "social",
    ];

    // Default states - all if not specified
    const statesToCrawl = states || null;

    // Create initial source logs for this run
    const logPromises = sourcesToCrawl.map((source: string) =>
      prisma.wholesaleSupplierSourceLog.create({
        data: {
          runId,
          sourcePlatform: source,
          sourceUrl: `${source}://pending`,
          status: "pending",
          recordsFound: 0,
          recordsNew: 0,
          recordsUpdated: 0,
          httpStatus: null,
          parseSuccess: false,
        },
      })
    );

    await Promise.all(logPromises);

    // Log the refresh request
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: "wholesale_refresh_triggered",
        entityType: "wholesale_supplier",
        entityId: runId,
        details: {
          manual_refresh,
          sources: sourcesToCrawl,
          states: statesToCrawl,
          full_crawl,
        },
      },
    });

    // TODO: Trigger actual background job to run scrapers
    // For now, we'll return a placeholder response
    // In production, this would queue a background job using:
    // - Bull/BullMQ for job queues
    // - Or trigger a serverless function
    // - Or use cron-like background task runner

    // Estimate duration based on sources and full_crawl
    const estimatedMinutes = full_crawl
      ? sourcesToCrawl.length * 15
      : sourcesToCrawl.length * 8;

    return NextResponse.json({
      run_id: runId,
      status: "started",
      estimated_duration_minutes: estimatedMinutes,
      sources_queued: sourcesToCrawl,
      states_queued: statesToCrawl || "all",
      progress_url: `/api/wholesale/admin/refresh/${runId}`,
      message:
        "Refresh job queued. Note: Background scraping is not yet implemented. This is a placeholder endpoint.",
    });
  } catch (error) {
    console.error("Error triggering refresh:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
