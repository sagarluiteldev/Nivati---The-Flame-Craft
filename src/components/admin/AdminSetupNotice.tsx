import { ExclamationTriangleIcon as ShieldAlert, CommandLineIcon as Terminal, ShareIcon as Workflow } from "@heroicons/react/24/outline";

interface Props {
  title?: string;
  details?: string | null;
}

export default function AdminSetupNotice({
  title = "Configuration Required",
  details,
}: Props) {
  return (
    <section className="w-full max-w-3xl rounded-[32px] border border-olive/10 bg-creme/90 p-8 shadow-xl shadow-olive/5 md:p-12">
      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-olive text-creme">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-olive/50">System Status</p>
          <h1 className="mt-2 text-3xl font-serif text-olive">{title}</h1>
        </div>
      </div>

      <p className="max-w-2xl text-base leading-7 text-olive/75">
        The Nivati Management Console is currently in a restricted state. To enable
        administrative access, ensure that all core services are properly initialized and
        security policies are correctly applied.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-olive/10 bg-olive/5 p-5">
          <Terminal className="h-5 w-5 text-olive" />
          <h2 className="mt-4 font-serif text-xl text-olive">Security Keys</h2>
          <p className="mt-2 text-sm leading-6 text-olive/70">
            System identity keys must be provisioned in the environment before secure
            connections can be established.
          </p>
        </div>

        <div className="rounded-3xl border border-olive/10 bg-olive/5 p-5">
          <Workflow className="h-5 w-5 text-olive" />
          <h2 className="mt-4 font-serif text-xl text-olive">Cloud Sync</h2>
          <p className="mt-2 text-sm leading-6 text-olive/70">
            The underlying database architecture requires a one-time initialization to
            synchronize product schemas.
          </p>
        </div>

        <div className="rounded-3xl border border-olive/10 bg-olive/5 p-5">
          <ShieldAlert className="h-5 w-5 text-olive" />
          <h2 className="mt-4 font-serif text-xl text-olive">Access Control</h2>
          <p className="mt-2 text-sm leading-6 text-olive/70">
            Ensure that at least one administrative profile has been explicitly whitelisted
            for this console.
          </p>
        </div>
      </div>

      {details ? (
        <div className="mt-8 rounded-3xl border border-terracotta/30 bg-terracotta/10 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-olive/45">Status Message</p>
          <p className="mt-2 text-sm leading-6 text-olive/75">{details}</p>
        </div>
      ) : null}
    </section>
  );
}

