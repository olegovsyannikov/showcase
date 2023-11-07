FROM registry.gitlab.com/privilege/cicd/php:7.4.13-nginx1.19

ARG BUILD_DATE
ARG VCS_REF

LABEL org.label-schema.build-date=$BUILD_DATE \
      org.label-schema.vcs-ref=$VCS_REF \
      org.label-schema.vcs-url="https://gitlab.com/privilege/api"

COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer
COPY . /app

RUN set -x \
    && composer install --optimize-autoloader --no-dev --no-interaction \
    && chown www-data:www-data -R /app
