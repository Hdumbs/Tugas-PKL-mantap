#!/bin/bash
set -e

# Run migrations and seed database if necessary
php artisan migrate --force
php artisan db:seed --force

# Start Apache server in foreground
exec apache2-foreground
