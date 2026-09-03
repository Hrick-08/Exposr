from setuptools import find_packages, setup

with open("README.md", encoding="utf-8") as f:
    long_description = f.read()

setup(
    name="exposr",
    version="0.5.0",
    description="Expose local TCP and UDP services to the public internet",

    long_description=long_description,
    long_description_content_type="text/markdown",

    packages=find_packages(),

    entry_points={
        "console_scripts": [
            "exposr=client.main:main",
        ],
    },

    python_requires=">=3.8",
)