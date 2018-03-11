FROM base/devel:latest

# fetch dependencies
RUN pacman --noconfirm -Syu bower cairo giflib gifsicle git graphicsmagick grunt-cli libjpeg-turbo npm optipng

# dependencies
USER nobody
WORKDIR /tmp
RUN curl "https://aur.archlinux.org/cgit/aur.git/snapshot/pngquant.tar.gz" | tar xzv && cd pngquant && makepkg
USER root
RUN pacman --noconfirm -U /tmp/pngquant/pngquant-*.pkg.tar.xz

# more dependencies
WORKDIR /unitdb
ENTRYPOINT npm install && bower install --allow-root && grunt serve

