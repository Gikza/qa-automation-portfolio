#!/usr/bin/env python3
"""Fail the build if any JMeter .jtl result file exceeds an error-rate threshold.

JMeter's CLI exits 0 even when every sample fails, so pass/fail has to be
computed from the results file. A proper csv.DictReader is used instead of a
naive comma-split, since fields like failureMessage can legitimately contain
commas and would otherwise misalign the columns.
"""
import csv
import glob
import os
import sys


def main() -> int:
    results_dir = sys.argv[1] if len(sys.argv) > 1 else "jmeter/results"
    threshold_pct = float(sys.argv[2]) if len(sys.argv) > 2 else 5.0

    failed_build = False
    for jtl_path in sorted(glob.glob(os.path.join(results_dir, "*.jtl"))):
        name = os.path.splitext(os.path.basename(jtl_path))[0]
        with open(jtl_path, newline="", encoding="utf-8") as f:
            rows = list(csv.DictReader(f))

        total = len(rows)
        if total == 0:
            continue

        failed = sum(1 for row in rows if row.get("success") == "false")
        error_pct = (failed / total) * 100
        print(f"{name}: {failed}/{total} failed ({error_pct:.2f}% error rate)")

        if error_pct > threshold_pct:
            print(f"::error::{name} exceeded the {threshold_pct}% error-rate threshold ({error_pct:.2f}%)")
            failed_build = True

    return 1 if failed_build else 0


if __name__ == "__main__":
    sys.exit(main())
