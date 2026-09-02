from setuptools import find_packages, setup


setup(
    name="openport",
    version="0.4.0",
    packages=find_packages(),
    entry_points={"console_scripts": ["openport=client.main:main"]},
)