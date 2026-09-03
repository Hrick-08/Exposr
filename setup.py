from setuptools import find_packages, setup


setup(
    name="exposr",
    version="0.5.0",
    packages=find_packages(),
    entry_points={"console_scripts": ["exposr=client.main:main"]},
)