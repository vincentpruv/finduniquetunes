export default function LegalPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-4xl font-medium">Legal Information</h1>
      <div className="mt-6 space-y-6">
        <section className="space-y-4">
          <h2 className="text-2xl font-medium">Disclaimer</h2>
          <p className="text-lg text-muted-foreground">
            Find Unique Tunes is not affiliated with, endorsed by, or in any way officially connected with Google LLC, YouTube LLC, or any of their subsidiaries or affiliates. The official YouTube website can be found at www.youtube.com.
          </p>
          <p className="text-lg text-muted-foreground">
            We do not receive any revenue from advertisements, monetization, or any other services provided by third parties including but not limited to YouTube and Google.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-medium">Service Usage</h2>
          <p className="text-lg text-muted-foreground">
            Our service acts solely as a curator and discovery platform for content that is publicly available on YouTube. We do not host, store, or distribute any audio or video content directly.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-medium">Trademarks</h2>
          <p className="text-lg text-muted-foreground">
            YouTube™ is a trademark of Google LLC. All other trademarks, service marks, and trade names referenced in this website are the property of their respective owners.
          </p>
        </section>
      </div>
    </div>
  );
}