# Use the official HAProxy image
FROM haproxy:2.4

# Work directory in the container
WORKDIR /usr/local/etc/haproxy/

# Copy the local HAProxy config file into the container
COPY haproxy.cfg /usr/local/etc/haproxy/haproxy.cfg

# Expose the port(s) HAProxy is configured to listen on
EXPOSE 80 443

# Command to run HAProxy
CMD ["haproxy", "-f", "/usr/local/etc/haproxy/haproxy.cfg"]