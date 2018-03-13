image_repo = "jesse/coop"
image_tag = `git rev-parse --short HEAD`
image_name = image_repo + ":" + image_tag
test_cmd = "truffle test"

build:
	docker build -t {{image_name}} .


test: build
	docker run {{image_name}} {{test_cmd}}

install package: build
        docker run -v `pwd`:/app {{image_name}}:{{image_tag}} npm install {{package}}



