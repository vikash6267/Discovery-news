#!/usr/bin/env bash
# Run this on the VPS first:  bash check-ports.sh
# Shows everything that is already listening and suggests a FREE port for the API.
set -u

echo "=== Ports already in use (LISTEN) ==="
if command -v ss >/dev/null 2>&1; then
  ss -tlnp 2>/dev/null | awk 'NR==1 || /LISTEN/' | awk '{print $1, $4, $6}' | column -t
else
  netstat -tlnp 2>/dev/null | awk 'NR<=2 || /LISTEN/'
fi

in_use() { (ss -tln 2>/dev/null || netstat -tln 2>/dev/null) | awk '{print $4}' | grep -Eq "[:.]$1$"; }

FREE=""
for p in 8080 8081 8082 4015 4016 5001 5002 7000 7001 9000 9001; do
  if ! in_use "$p"; then FREE="$p"; break; fi
done

echo
echo "=== Free ports among common choices ==="
for p in 8080 8081 8082 4015 4016 5001 5002 7000 7001 9000 9001; do
  if in_use "$p"; then echo "  $p  -> BUSY"; else echo "  $p  -> free"; fi
done
echo
echo "Suggested API port: ${FREE:-none found, pick any above 10000}"
echo "(Ports 80 and 443 are used by Nginx for HTTPS – the API port itself stays private on 127.0.0.1.)"
echo
echo "=== Server size (for tuning) ==="
echo "CPU cores : $(nproc)"
free -m | awk 'NR==2{print "RAM       : "$2" MB total, "$7" MB available"}'
free -m | awk 'NR==3{print "Swap      : "$2" MB"}'
df -h / | awk 'NR==2{print "Disk free : "$4" of "$2}'
