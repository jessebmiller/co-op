image_name = "jesse/coop"
image_tag = `git rev-parse --short HEAD`


build:
	docker build -t {{image_name}}:{{image_tag}} .


install package: build
        docker run -v $(pwd):/app {{image_name}}:{{image_tag}} npm install {{package}}
