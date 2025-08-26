
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' 

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

ENVIRONMENT="production"
BUILD_ARGS=""
PUSH_IMAGE=false
IMAGE_TAG="latest"

while [[ $# -gt 0 ]]; do
    case $1 in
        -e|--environment)
            ENVIRONMENT="$2"
            shift 2
            ;;
        -t|--tag)
            IMAGE_TAG="$2"
            shift 2
            ;;
        -p|--push)
            PUSH_IMAGE=true
            shift
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  -e, --environment    Build environment (production|development) [default: production]"
            echo "  -t, --tag           Image tag [default: latest]"
            echo "  -p, --push          Push image to registry after build"
            echo "  -h, --help          Show this help message"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

if [[ "$ENVIRONMENT" == "development" ]]; then
    IMAGE_NAME="metrics-dashboard:dev-$IMAGE_TAG"
    DOCKERFILE="Dockerfile.dev"
    print_status "Building development image..."
else
    IMAGE_NAME="metrics-dashboard:$IMAGE_TAG"
    DOCKERFILE="Dockerfile"
    print_status "Building production image..."
fi

if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

print_status "Building Docker image: $IMAGE_NAME"
print_status "Using Dockerfile: $DOCKERFILE"

if docker build -f "$DOCKERFILE" -t "$IMAGE_NAME" .; then
    print_status "Successfully built image: $IMAGE_NAME"
else
    print_error "Failed to build Docker image"
    exit 1
fi

IMAGE_SIZE=$(docker images "$IMAGE_NAME" --format "table {{.Size}}" | tail -n 1)
print_status "Image size: $IMAGE_SIZE"

if [[ "$PUSH_IMAGE" == true ]]; then
    print_status "Pushing image to registry..."
    if docker push "$IMAGE_NAME"; then
        print_status "Successfully pushed image: $IMAGE_NAME"
    else
        print_error "Failed to push image"
        exit 1
    fi
fi

print_status "Image built successfully!"
echo ""
echo "Image Details:"
echo "  Name: $IMAGE_NAME"
echo "  Size: $IMAGE_SIZE"
echo "  Environment: $ENVIRONMENT"
echo ""
echo "Run the image with:"
if [[ "$ENVIRONMENT" == "development" ]]; then
    echo "  docker run -p 5173:5173 $IMAGE_NAME"
else
    echo "  docker run -p 80:80 $IMAGE_NAME"
fi
echo ""
echo "Or use docker-compose:"
if [[ "$ENVIRONMENT" == "development" ]]; then
    echo "  docker-compose -f docker-compose.dev.yml up"
else
    echo "  docker-compose up"
fi
