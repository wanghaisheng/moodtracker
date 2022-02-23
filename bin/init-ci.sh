set -euo pipefail

handle_error() {
  echo "💣 Error on line $1, exit code $2 💣"
  exit $2
}

trap 'handle_error $LINENO $?' ERR

pushd client > /dev/null
echo "⏳ Installing Node.js dependencies with Yarn... ⏳"
yarn
echo "🍄 Node.js dependencies successfully installed! 🍄"
popd > /dev/null

echo "🍄 All dependencies successfully installed! 🍄"