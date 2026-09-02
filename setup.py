from setuptools import setup

setup(
    name="openport",
    version="0.2.0",
    py_modules=["agent"],
    package_dir={"": "client"},
    entry_points={
        "console_scripts": [
            "openport=agent:main",
        ],
    },
)