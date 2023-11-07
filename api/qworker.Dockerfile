FROM registry.gitlab.com/privilege/cicd/php:7.4.13

ARG BUILD_DATE
ARG VCS_REF

LABEL org.label-schema.build-date=$BUILD_DATE \
      org.label-schema.vcs-ref=$VCS_REF \
      org.label-schema.vcs-url="https://gitlab.com/privilege/api"

# New Relic PHP Agent installation
# RUN \
#   curl -L https://download.newrelic.com/php_agent/release/newrelic-php5-10.11.0.3-linux-musl.tar.gz | tar -C /tmp -zx && \
#   export NR_INSTALL_USE_CP_NOT_LN=1 && \
#   export NR_INSTALL_SILENT=1 && \
#   /tmp/newrelic-php5-*/newrelic-install install && \
#   rm -rf /tmp/newrelic-php5-* /tmp/nrinstall* && \
#   sed -i \
#       -e 's/"REPLACE_WITH_REAL_KEY"/"eu01xx3df2d4ed6a2b85b458ed9859c0db71NRAL"/' \
#       -e 's/newrelic.appname = "PHP Application"/newrelic.appname = "api-qworker"/' \
#       -e 's/;newrelic.daemon.app_connect_timeout =.*/newrelic.daemon.app_connect_timeout=15s/' \
#       -e 's/;newrelic.daemon.start_timeout =.*/newrelic.daemon.start_timeout=5s/' \
#       /usr/local/etc/php/conf.d/newrelic.ini

COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer
COPY . /app

RUN set -x \
    && composer install --optimize-autoloader --no-dev --no-interaction \
    && chown www-data:www-data -R /app

CMD ["php", "artisan", "queue:work"]
